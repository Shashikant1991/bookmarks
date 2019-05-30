import {ChangeDetectionStrategy, Component, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, filter, first, map, takeUntil} from 'rxjs/operators';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {EditorGetDocumentAction} from '../../../states/editor/editor-get-document.action';
import {GroupsPublishAction} from '../../../states/storage/groups/groups-publish.action';
import {ItemsCreateAction} from '../../../states/storage/items/items-create.action';
import {ItemsPatchAction} from '../../../states/storage/items/items-patch.action';
import {ItemsState} from '../../../states/storage/items/items.state';
import {MetaService} from '../../api/meta/meta.service';
import {LogService} from '../../dev-tools/log/log.service';
import {TimeoutService} from '../../dev-tools/timeout/timeout.service';
import {EditorModalInterface} from '../../editor/editor-modal-interface';
import {EDITOR_MODAL_TOKEN} from '../../editor/editor-modal-token';
import {ItemEntity} from '../../networks/entities/item.entity';
import {EntityIdType} from '../../networks/networks.types';
import {TagValidators} from '../../validators/validate-url';
import {ItemMetaToolService} from '../item-tools/item-meta-tool.service';
import {MetaToolData} from '../meta-tool-types';

@Component({
    selector: 'tag-item-form',
    templateUrl: './item-form.component.html',
    styleUrls: ['./item-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFormComponent implements OnInit, OnDestroy {
    public controlTitle: FormControl;

    public controlUrl: FormControl;

    public group: FormGroup;

    @ViewChild('inputTitle', { read: ElementRef, static: true })
    public inputTitle: ElementRef<HTMLInputElement>;

    @ViewChild('inputUrl', { read: ElementRef, static: true })
    public inputUrl: ElementRef<HTMLInputElement>;

    public itemMetaTitle$: Observable<string>;

    private readonly _destroyed$: Subject<void> = new Subject<void>();

    private _item$: Observable<ItemEntity>;

    private readonly _log: LogService;

    private _ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public constructor(private _meta: MetaService,
                       private _store: Store,
                       private _timeOut: TimeoutService,
                       private _zone: NgZone,
                       @Inject(EDITOR_MODAL_TOKEN) private _editorModal: EditorModalInterface,
                       public itemMetaTool: ItemMetaToolService,
                       log: LogService) {
        this._log = log.withPrefix(ItemFormComponent.name);
        this.controlTitle = new FormControl('');
        this.controlUrl = new FormControl('', [TagValidators.validateUrl, Validators.required]);
        this.group = new FormGroup({title: this.controlTitle, url: this.controlUrl});
        this.itemMetaTitle$ = itemMetaTool.title();
    }

    private _itemId: EntityIdType;

    public get itemId(): EntityIdType {
        return this._itemId;
    }

    @Input()
    public set itemId(itemId: EntityIdType) {
        this._itemId = itemId;
        // @todo This should be done via OnInit()
        this._item$ = this._store.select(ItemsState.byId).pipe(map(selector => selector(itemId)));
        this._item$.pipe(
            first(),
            takeUntil(this._destroyed$)
        ).subscribe(item => this.group.setValue({title: item.title, url: item.url}));
    }

    @Input()
    public set ready(value: boolean) {
        this._ready$.next(value);
    }

    public keyPressTitle(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.updateItemAndValidate().then(success => success && this._closeEditor());
        }
    }

    public keyPressUrl(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }

        this.updateItemAndValidate().then(success => {
            if (!success) {
                return;
            }

            this._item$.pipe(first())
                .subscribe((item: ItemEntity) => {
                    const actions: any[] = [new EditorGetDocumentAction(new GroupsPublishAction())];
                    if (item._new) {
                        actions.push(new ItemsCreateAction(this._zone, item.card_id));
                    }
                    this._store.dispatch(actions).subscribe(() => {
                        if (this.controlTitle.value) {
                            this._closeEditor();
                        } else {
                            this.itemMetaTool.fetchMeta();
                        }
                    });
                });
        });
    }

    public ngOnDestroy(): void {
        this.itemMetaTool.cancel();
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this._ready$.pipe(
            distinctUntilChanged(),
            filter(Boolean),
            takeUntil(this._destroyed$)
        ).subscribe(() => this.setFocus());

        this.itemMetaTool.beforeTrigger().pipe(
            takeUntil(this._destroyed$)
        ).subscribe(() => {
            this._rewriteUrl();
            this.itemMetaTool.setDisabled(this.group.invalid);
            this.itemMetaTool.setUrl(this.controlUrl.value);
        });

        this.itemMetaTool.getData().pipe(
            takeUntil(this._destroyed$)
        ).subscribe((result: MetaToolData) => {
            if (result.success) {
                if (result.title) {
                    this._setTitle(result.title);
                }
                if (result.image) {
                    this._setImage(result.image);
                }
                this.focusTitle();
            } else {
                if (this.controlTitle.value) {
                    this.focusTitle();
                } else {
                    this.focusUrl();
                }
            }
        });

        this.itemMetaTool.disabled().pipe(
            takeUntil(this._destroyed$)
        ).subscribe(disabled => disabled ? this.group.disable() : this.group.enable());
    }

    public setFocus() {
        combineLatest([
            this._store.select(CardEditorState.itemId),
            this._store.select(CardEditorState.itemFocusTitle)
        ]).pipe(
            first(),
            filter(([itemId]) => itemId === this._itemId)
        ).subscribe(([itemId, focus]) => {
            if (focus) {
                this.focusTitle();
            } else {
                this.focusUrl();
            }
        });
    }

    public updateItemAndValidate(): Promise<boolean> {
        return new Promise(resolver => {
            this._rewriteUrl();
            if (this.group.invalid) {
                resolver(false);
                return;
            }
            this._item$.pipe(first())
                .subscribe(item => {
                    const patch = Object.keys(this.group.value)
                        .filter(key => this.group.value[key] !== item[key])
                        .reduce((current, key) => ({...current, [key]: this.group.value[key]}), {});
                    this._store.dispatch(new ItemsPatchAction(item.id, patch))
                        .subscribe(() => resolver(true));
                });
        });
    }

    private _closeEditor() {
        this._editorModal.close();
    }

    private _rewriteUrl() {
        let url = this.controlUrl.value;
        if (url !== null) {
            url = TagValidators.toUrl(url);
            if (url !== this.controlUrl.value) {
                this.controlUrl.setValue(url);
            }
        }
    }

    private _setImage(image: string) {
        this._store.dispatch(new ItemsPatchAction(this._itemId, {image}));
    }

    private _setTitle(title: string) {
        this.controlTitle.setValue(title);
        this._store.dispatch(new ItemsPatchAction(this._itemId, {title}));
    }

    private _setUrl(url: string) {
        this.controlUrl.setValue(url);
        this._store.dispatch(new ItemsPatchAction(this._itemId, {url}));
    }

    private focusTitle() {
        this._timeOut.run()
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => this.inputTitle.nativeElement.focus());
    }

    private focusUrl() {
        this._timeOut.run()
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => this.inputUrl.nativeElement.focus());
    }
}

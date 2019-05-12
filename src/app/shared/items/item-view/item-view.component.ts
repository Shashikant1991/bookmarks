import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {EditorState} from '../../../states/editor/editor.state';
import {ItemsState} from '../../../states/editor/items/items.state';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {ItemEntity} from '../../networks/entities/item.entity';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-item-view',
    templateUrl: './item-view.component.html',
    styleUrls: ['./item-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemViewComponent implements OnDestroy {

    public item$: Observable<ItemEntity>;

    @Select(EditorState.showUrls)
    public showUrl$: Observable<boolean>;

    private readonly _destroyed: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _keyboard: KeyboardService,
                       private _el: ElementRef<HTMLElement>,
                       log: LogService) {
        this._log = log.withPrefix(ItemViewComponent.name);
    }

    private _itemId: EntityIdType;

    public get itemId(): EntityIdType {
        return this._itemId;
    }

    @Input()
    public set itemId(value: EntityIdType) {
        this._itemId = value;
        this.item$ = this._store.select(ItemsState.byId).pipe(map(selector => selector(value)));
        // this.showUrl$ = combineLatest(
        //     this._store.select(CardEditorState.isCardEditorOpen),
        //     this._keyboard.shift$
        // ).pipe(map(([isOpen, shift]) => isOpen ? false : shift));
    }

    public hasChildElement(parent: Element, child: Element): boolean {
        if (child === this._el.nativeElement) {
            return true;
        } else if (parent === child) {
            return false;
        }
        return child.parentElement
            ? this.hasChildElement(parent, child.parentElement)
            : false;
    }

    public ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }
}

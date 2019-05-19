import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    QueryList,
    ViewChildren
} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {fromEvent, merge, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, filter, map, takeUntil, withLatestFrom} from 'rxjs/operators';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {CardsState} from '../../../states/storage/cards/cards.state';
import {DragState} from '../../../states/editor/drag/drag.state';
import {EditorCardIdAction} from '../../../states/editor/editor-card-id.action';
import {EditorState} from '../../../states/editor/editor.state';
import {SelectionsState} from '../../../states/editor/selections/selections.state';
import {DragModel, DragStateEnum} from '../../../states/models/drag-model';
import {Point} from '../../../utils/shapes/point';
import {Rectangle} from '../../../utils/shapes/rectangle';
import {BookmarksService} from '../../../lazy/bookmarks/bookmarks.service';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {DragBehaviorService} from '../../drag/drag-behavior/drag-behavior.service';
import {DragEventsService} from '../../drag/drag-events/drag-events.service';
import {DragManagerEvent} from '../../drag/drag-manager.event';
import {EditorModalInterface} from '../../editor/editor-modal-interface';
import {EDITOR_MODAL_TOKEN} from '../../editor/editor-modal-token';
import {EditorQuery} from '../../editor/editor-modal/editor.query';
import {GroupComponent} from '../../groups/group/group.component';
import {ItemViewComponent} from '../../items/item-view/item-view.component';
import {LayoutTileComponent} from '../../layouts/layout-tile/layout-tile.component';
import {CardEntity} from '../../networks/entities/card.entity';
import {EntityId, EntityIdType} from '../../networks/networks.types';
import {ReactiveTool} from '../../reactive-tools/reactive-tool';
import {CardContext} from '../card-tools/card-context';
import {CARD_TOOL_PROVIDERS, CARD_TOOL_TOKEN} from '../card-tools/card-tool-providers';

const IGNORE_MOUSE_EVENTS = ['A', 'BUTTON', 'INPUT', 'SELECT'];

@Component({
    selector: 'tag-card-view',
    templateUrl: './card-view.component.html',
    styleUrls: ['./card-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        CardContext,
        ...CARD_TOOL_PROVIDERS
    ]
})
export class CardViewComponent implements OnInit, OnDestroy {
    public card$: Observable<CardEntity>;

    @Select(EditorState.cardId)
    public editorStateCardId$: Observable<number>;

    public isCardEdit$: Observable<boolean>;

    @ViewChildren(ItemViewComponent)
    public itemViews: QueryList<ItemViewComponent>;

    public mouseHover: boolean = false;

    @Select(SelectionsState.someSelected)
    public someSelected$: Observable<boolean>;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _el: ElementRef<HTMLElement>,
                       private _context: CardContext,
                       private _dragEvents: DragEventsService,
                       private _dragBehavior: DragBehaviorService,
                       private _bookmarks: BookmarksService,
                       @Inject(EDITOR_MODAL_TOKEN) private _editorModal: EditorModalInterface,
                       @Inject(CARD_TOOL_TOKEN) public cardTools: ReactiveTool[],
                       public keyboard: KeyboardService,
                       @Optional() private _group: GroupComponent,
                       @Optional() private _tile: LayoutTileComponent,
                       log: LogService) {
        this._log = log.withPrefix(CardViewComponent.name);
    }

    private _cardId: EntityIdType;

    public get cardId(): EntityIdType {
        return this._cardId;
    }

    @Input()
    public set cardId(cardId: EntityIdType) {
        this._cardId = cardId;
        this.card$ = this._store.select(CardsState.byId).pipe(map(selector => selector(cardId)));
        this.isCardEdit$ = this._store.select(CardEditorState.cardId).pipe(map(id => id === cardId));
        this._context.setCardId(cardId);
    }

    // noinspection JSUnusedGlobalSymbols
    public entityTrackBy(indx: number, entity: EntityId): EntityIdType {
        return entity.id;
    }

    public menuClosed() {
        this._store.dispatch(new EditorCardIdAction(null));
    }

    public menuOpened() {
        this._store.dispatch(new EditorCardIdAction(this.cardId));
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        const el = this._el.nativeElement;

        this._editorModal.query().pipe(
            filter(query => query.cardId === this._cardId),
            this._log.stream(`queryTo:${this._cardId}`),
            takeUntil(this._destroyed$)
        ).subscribe((query: EditorQuery) => query.done(el.getBoundingClientRect()));

        this._dragEvents.onMove().pipe(
            withLatestFrom(this._store.select(DragState)),
            filter(([event, dragState]: [DragManagerEvent, DragModel]) =>
                dragState.type === 'card'
                && dragState.state === DragStateEnum.SORT_CARDS
                && dragState.drag_id !== this.cardId
            ),
            takeUntil(this._destroyed$)
        ).subscribe(([event, dragState]: [DragManagerEvent, DragModel]) => {
            const rect = Rectangle.fromRef(this._el);
            if (rect.inside(event.move)) {
                // const [top, bottom] = rect.split(true);
                // @todo Intersection is now handled by the group component, because it has to use a layout snapshot.
                // this._group.dragReorder(dragState.drag_id, this.cardId);
            }
        });

        if (this._tile) {
            this.card$.pipe(
                filter(Boolean),
                map((card: CardEntity) => `${Boolean(card.title)}:${card._item_ids.length}`),
                distinctUntilChanged(),
                takeUntil(this._destroyed$)
            ).subscribe(() => this._tile.checkHeight());
        }

        let dragging = false;

        type Params = [MouseEvent, boolean, boolean];
        merge(
            fromEvent(el, 'click'),
            fromEvent(el, 'mousedown'),
            fromEvent(el, 'mouseup')
        ).pipe(
            withLatestFrom(this.keyboard.ctrl$, this._store.select(SelectionsState.someSelected)),
            filter(([event, ctrl, someSelected]: Params) => event.target instanceof HTMLElement
                && !someSelected
                && !IGNORE_MOUSE_EVENTS.includes((<HTMLElement>event.target).tagName)
            ),
            takeUntil(this._destroyed$)
        ).subscribe(([event, ctrl]: Params) => {
            this._log.debug(`mouse:${event.type} ctrl:${ctrl}`, event);
            const target = <HTMLElement>event.target;
            switch (event.type) {
                case 'click':
                    if (event.button === 0) {
                        if (target.classList.contains('tag-card-title')) {
                            if (ctrl) {
                                this._bookmarks.openCard(this._cardId);
                            } else {
                                this._editorModal.edit(this.cardId, true);
                            }
                        } else {
                            const itemView = this.itemViews.find(item => item.hasChildElement(el, target));
                            if (itemView && itemView.itemId) {
                                this._editorModal.edit(this.cardId, true, itemView.itemId);
                            } else {
                                this._editorModal.edit(this.cardId, false);
                            }
                        }
                    }
                    break;
                case 'mousedown':
                    if (event.button === 0) {
                        dragging = true;
                        const rect = Rectangle.fromRef(this._el);
                        const offset = Point.fromEvent(event).subtract(rect.grow(2).upperLeft());
                        this._dragEvents.dragDistance(Point.fromEvent(event), 10).then(dragStart => {
                            if (dragStart && dragging) {
                                const size = new Point(rect.width, rect.height);
                                this._dragBehavior.dragCard(this.cardId, offset, dragStart, size);
                            }
                        });
                    }
                    break;
                case 'mouseup':
                    dragging = false;
                    if (event.button === 1 && target.classList.contains('tag-card-title')) {
                        this._bookmarks.openCard(this._cardId);
                    }
                    break;
            }
        });
    }
}

import {animate, AnimationEvent, state, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnDestroy, OnInit, Optional} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {BehaviorSubject, combineLatest, merge, Observable, ReplaySubject, Subject} from 'rxjs';
import {distinctUntilChanged, filter, map, takeUntil, withLatestFrom} from 'rxjs/operators';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {DragState} from '../../../states/editor/drag/drag.state';
import {ItemsState} from '../../../states/storage/items/items.state';
import {DragStateEnum} from '../../../states/models/drag-model';
import {Point} from '../../../utils/shapes/point';
import {Rectangle} from '../../../utils/shapes/rectangle';
import {CardDragItemsComponent} from '../../cards/card-drag-items/card-drag-items.component';
import {LogService} from '../../dev-tools/log/log.service';
import {DragEventsService} from '../../drag/drag-events/drag-events.service';
import {DragManagerEvent} from '../../drag/drag-manager.event';
import {CardEntity} from '../../networks/entities/card.entity';
import {ItemEntity} from '../../networks/entities/item.entity';
import {EntityIdType} from '../../networks/networks.types';
import {ReactiveTool} from '../../reactive-tools/reactive-tool';
import {ItemCloseToolService} from '../item-tools/item-close-tool.service';
import {ItemContext} from '../item-tools/item-context';
import {ItemMetaToolService} from '../item-tools/item-meta-tool.service';
import {ITEM_TOOL_PROVIDERS, ITEM_TOOL_TOKEN} from '../item-tools/item-tool-providers';

@Component({
    selector: 'tag-item-edit',
    templateUrl: './item-edit.component.html',
    styleUrls: ['./item-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ItemContext,
        ItemCloseToolService,
        ItemMetaToolService,
        ...ITEM_TOOL_PROVIDERS
    ],
    host: {
        '[@fadeInOut]': '"open"',
        '(mouseover)': 'mouseHover$.next(true)',
        '(mouseleave)': 'mouseHover$.next(false)'
    },
    animations: [
        trigger('fadeInOut', [
            transition('x => y', [
                style({opacity: 0, height: 0}),
                animate('300ms ease-in-out', style({opacity: 1, height: '*'}))
            ]),
            transition('y => x', [
                style({opacity: 1, height: '*'}),
                animate('300ms ease-in-out', style({opacity: 0, height: 0}))
            ])
        ]),
        trigger('slide', [
            state('close', style({'height': 0})),
            state('open', style({'height': '*'})),
            transition('open => close', [
                style({height: '*'}),
                animate('300ms ease-in-out', style({height: 0}))
            ]),
            transition('close => open', [
                style({height: 0}),
                animate('300ms ease-in-out', style({height: '*'}))
            ])
        ])
    ]
})
export class ItemEditComponent implements OnDestroy, OnInit {
    @Select(CardEditorState.card)
    public card$: Observable<CardEntity>;

    public editorOpen$: Observable<boolean>;

    public readonly isHovering: boolean;

    public isNew$: Observable<boolean>;

    public isVisible$: Observable<boolean>;

    public readonly menuOpen$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public readonly mouseHover$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public showControls$: Observable<boolean>;

    public showItemForm$: Observable<boolean>;

    public slideEvents$: ReplaySubject<AnimationEvent> = new ReplaySubject(1);

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _context: ItemContext,
                       private _el: ElementRef<HTMLElement>,
                       private _dragEvents: DragEventsService,
                       public itemCloseTool: ItemCloseToolService,
                       @Inject(ITEM_TOOL_TOKEN) public itemTools: ReactiveTool[],
                       @Optional() private _cardDragItems: CardDragItemsComponent,
                       log: LogService) {
        this._log = log.withPrefix(ItemEditComponent.name);
        this.isHovering = !this._cardDragItems;
    }

    private _itemId: EntityIdType;

    public get itemId(): EntityIdType {
        return this._itemId;
    }

    @Input()
    public set itemId(itemId: EntityIdType) {
        this._itemId = itemId;
        this._context.setItemId(itemId);
        this.editorOpen$ = this._store.select(CardEditorState.itemId).pipe(map(id => id === itemId), distinctUntilChanged());
        this.showControls$ = combineLatest(this.mouseHover$, this.menuOpen$, this.editorOpen$)
            .pipe(map(([hover, menu, open]) => (menu || hover || open) && itemId !== 0));
        this.showItemForm$ = merge(
            this.editorOpen$.pipe(filter(Boolean)),
            this.slideEvents$.pipe(
                filter(event => event.phaseName === 'done' && event.toState === 'close'),
                map(() => false)
            )
        );
        this.isNew$ = this._store.select(ItemsState.byId).pipe(
            map(selector => selector(itemId)),
            filter(Boolean),
            map((item: ItemEntity) => Boolean(item._new)),
            distinctUntilChanged()
        );
        this.isVisible$ = this._store.select(ItemsState.byId).pipe(
            map(selector => selector(itemId)),
            filter(Boolean),
            map((item: ItemEntity) => item._visible !== false),
            distinctUntilChanged()
        );
    }

    public getSize(): Point {
        const rect = Rectangle.fromRef(this._el);
        return new Point(rect.width, rect.height);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        if (this._cardDragItems) {
            this._dragBehaviors();
        }
    }

    private _dragBehaviors() {
        type Params = [DragManagerEvent, DragStateEnum, ItemEntity];
        this._dragEvents.onMove().pipe(
            withLatestFrom(
                this._store.select(DragState.state),
                this._store.select(ItemsState.byId).pipe(map(selector => selector(this.itemId)))
            ),
            filter(([event, dragState, item]: Params) => dragState === DragStateEnum.SORT_ITEMS && !item._new),
            takeUntil(this._destroyed$)
        ).subscribe(([event]: Params) => {
            const rect = Rectangle.fromRef(this._el);
            if (rect.inside(event.move)) {
                const [top, bottom] = rect.split(true);
                this._cardDragItems.dragReorder(this.itemId, top.inside(event.move));
            }
        });
    }
}

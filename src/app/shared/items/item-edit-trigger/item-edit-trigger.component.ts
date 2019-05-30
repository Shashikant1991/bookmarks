import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Store} from '@ngxs/store';
import {combineLatest, Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';
import {CardEditorItemIdAction} from '../../../states/editor/card-editor/card-editor-item-id.action';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {ItemsState} from '../../../states/storage/items/items.state';
import {KeyboardService} from '../../dev-tools/keyboard/keyboard.service';
import {LogService} from '../../dev-tools/log/log.service';
import {CardEntity} from '../../networks/entities/card.entity';
import {ItemEntity} from '../../networks/entities/item.entity';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-item-edit-trigger',
    templateUrl: './item-edit-trigger.component.html',
    styleUrls: ['./item-edit-trigger.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(click)': 'click($event)'
    }
})
export class ItemEditTriggerComponent {

    public item$: Observable<ItemEntity>;

    public showLongUrl$: Observable<boolean>;

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _keyboard: KeyboardService,
                       log: LogService) {
        this._log = log.withPrefix(ItemEditTriggerComponent.name);
    }

    private _itemId: EntityIdType;

    public get itemId(): EntityIdType {
        return this._itemId;
    }

    @Input()
    public set itemId(itemId: EntityIdType) {
        this._itemId = itemId;
        this.item$ = this._store.select(ItemsState.byId).pipe(map(selector => selector(itemId)));
        this.showLongUrl$ = combineLatest([
            this._keyboard.shift$,
            this._store.select(CardEditorState.isItemEditorOpen)
        ]).pipe(map(([shift, open]) => shift && !open));
    }

    public click(event: MouseEvent, focusTitle: boolean = true) {
        event.stopPropagation();
        if (event.altKey || event.ctrlKey) {
            return;
        }
        event.preventDefault();
        combineLatest([
            this.item$,
            this._store.select(CardEditorState.itemId),
            this._store.select(CardEditorState.card)
        ]).pipe(first())
            .subscribe(([item, itemId, card]: [ItemEntity, EntityIdType, CardEntity]) => {
                const editorItemId = itemId === this._itemId ? null : this._itemId;
                if (card._item_ids.length === 1 && editorItemId === null) {
                    return;
                }
                this._store.dispatch(new CardEditorItemIdAction(editorItemId, !item._new && focusTitle));
            });
    }
}

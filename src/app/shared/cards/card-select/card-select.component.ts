import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SelectionsToggleAction} from '../../../states/editor/selections/selections-toggle.action';
import {SelectionsState} from '../../../states/editor/selections/selections.state';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-card-select',
    templateUrl: './card-select.component.html',
    styleUrls: ['./card-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(click)': '$event.stopPropagation()'
    }
})
export class CardSelectComponent {
    public isSelected$: Observable<boolean>;

    @Input()
    public show: boolean;

    public someSelected$: Observable<boolean>;

    public constructor(private _store: Store) {
        this.someSelected$ = this._store.select(SelectionsState.someSelected);
    }

    private _cardId: EntityIdType;

    @Input()
    public set cardId(cardId: EntityIdType) {
        this._cardId = cardId;
        this.isSelected$ = this._store.select(SelectionsState.isSelected).pipe(map(selector => selector(cardId)));
    }

    public click() {
        this._store.dispatch(new SelectionsToggleAction(this._cardId));
    }
}

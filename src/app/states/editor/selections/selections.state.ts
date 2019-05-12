import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {CardEntity} from '../../../shared/networks/entities/card.entity';
import {EntityMap} from '../../../shared/networks/entities/entity-map';
import {GroupEntity} from '../../../shared/networks/entities/group.entity';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {SelectionsModel} from '../../models/selections-model';
import {CardsState} from '../cards/cards.state';
import {GroupsState} from '../groups/groups.state';
import {SelectionsAllAction} from './selections-all.action';
import {SelectionsClearAction} from './selections-clear.action';
import {SelectionsToggleAction} from './selections-toggle.action';

type SelectionsContext = StateContext<SelectionsModel>;

@State<SelectionsModel>({
    name: 'selections',
    defaults: {
        cards: []
    }
})
export class SelectionsState {

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       log: LogService) {
        this._log = log.withPrefix(SelectionsState.name);
    }

    @Selector([CardsState])
    public static cards(state: SelectionsModel, cards: EntityMap<CardEntity>) {
        return state.cards.map(cardId => cards[cardId]);
    }

    @Selector()
    public static count(state: SelectionsModel) {
        return state.cards.length;
    }

    @Selector([CardsState, GroupsState])
    public static groups(state: SelectionsModel, cards: EntityMap<CardEntity>, groups: EntityMap<GroupEntity>) {
        const group_ids = Array.from(new Set(state.cards.map((cardId: number) => cards[cardId].group_id)));
        return group_ids.map(groupId => groups[groupId]);
    }

    @Selector()
    public static isSelected(state: SelectionsModel) {
        return (cardId: EntityIdType) => state.cards.some(id => id === cardId);
    }

    @Selector()
    public static noneSelected(state: SelectionsModel) {
        return state.cards.length === 0;
    }

    @Selector()
    public static selected(state: SelectionsModel) {
        return state.cards;
    }

    @Selector()
    public static someSelected(state: SelectionsModel) {
        return Boolean(state.cards.length);
    }

    @Action(SelectionsAllAction)
    public selectionsAllAction(ctx: SelectionsContext) {
        const cardsState: EntityMap<CardEntity> = this._store.selectSnapshot(CardsState);
        const cards = Object.values(cardsState).filter(card => card.id !== 0).map(card => card.id);
        ctx.patchState({cards});
    }

    @Action(SelectionsClearAction)
    public selectionsClearAction(ctx: SelectionsContext) {
        ctx.patchState({cards: []});
    }

    @Action(SelectionsToggleAction)
    public selectionsToggleAction(ctx: SelectionsContext, action: SelectionsToggleAction) {
        let cards = [...ctx.getState().cards];
        if (cards.some(id => id === action.card_id)) {
            cards = cards.filter(id => id !== action.card_id);
        } else {
            cards.push(action.card_id);
        }
        ctx.patchState({cards});
    }
}

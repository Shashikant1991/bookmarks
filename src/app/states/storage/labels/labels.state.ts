import {NgZone} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {EntityMap} from '../../../shared/networks/entities/entity-map';
import {ItemEntity} from '../../../shared/networks/entities/item.entity';
import {LabelEntity} from '../../../shared/networks/entities/label.entity';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {ChangesTracker} from '../../changes/changes-tracker';
import {LabelsSetAction} from './labels-set.action';

type LabelsContext = StateContext<EntityMap<LabelEntity>>;

@State<EntityMap<LabelEntity>>({
    name: 'labels',
    defaults: {}
})
export class LabelsState {
    private readonly _log: LogService;

    private readonly _tracker: ChangesTracker<ItemEntity>;

    public constructor(private _zone: NgZone,
                       log: LogService) {
        this._log = log.withPrefix(LabelsState.name);
        this._tracker = new ChangesTracker(this._log, true, 'labels');
    }

    @Selector()
    public static byId(state: EntityMap<LabelEntity>) {
        return (id: EntityIdType) => state[id];
    }

    /**
     * @deprecated This will need to be moved to the users state to work the same as the document_ids
     */
    @Selector()
    public static labelIds(state: EntityMap<LabelEntity>) {
        return Object.keys(state);
    }

    @Action(LabelsSetAction)
    public labelsSetAction(ctx: LabelsContext, action: LabelsSetAction) {
        ctx.setState(action.labels.reduce((curr, next) => ({...curr, [next.id]: next}), {}));
    }
}

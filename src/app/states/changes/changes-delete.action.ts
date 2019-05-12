import {EntityChange, EntityChangeEnum, EntityIdType} from '../../shared/networks/networks.types';

export class ChangesDeleteAction {
    public static readonly type: string = '[Changes] delete';

    public readonly change: EntityChange;

    public constructor(model: string, id: EntityIdType) {
        this.change = {type: EntityChangeEnum.DELETE, id, model};
    }
}

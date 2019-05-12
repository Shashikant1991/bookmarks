import {EntityChange, EntityChangeEnum, EntityIdType} from '../../shared/networks/networks.types';
import {ChangesCloneSource} from './changes-clone-source';

export class ChangesCreateAction {
    public static readonly type: string = '[Changes] create';

    public readonly change: EntityChange;

    public constructor(model: string, id: EntityIdType, source: any) {
        this.change = {type: EntityChangeEnum.CREATE, id, model, value: ChangesCloneSource(source)};
    }
}

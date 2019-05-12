import {EntityChange, EntityChangeEnum, EntityIdType} from '../../shared/networks/networks.types';
import {ChangesCloneSource} from './changes-clone-source';

export class ChangesPatchAction {
    public static readonly type: string = '[Changes] patch';

    public readonly change: EntityChange;

    public constructor(model: string, id: EntityIdType, source: any) {
        this.change = {type: EntityChangeEnum.PATCH, id, model, value: ChangesCloneSource(source)};
    }
}

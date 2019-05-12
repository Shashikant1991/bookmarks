import {EntityIdType} from '../../shared/networks/networks.types';

export class UsersTokenAction {
    public static readonly type: string = '[Users] token';

    public constructor(public readonly user_id: EntityIdType,
                       public readonly session_id: string) {
    }
}

import {UserEntity} from '../../shared/networks/entities/user.entity';

export class UsersSessionActive {
    public static readonly type: string = '[Users] session';

    public constructor(public readonly user: UserEntity,
                       public readonly remember: boolean) {

    }
}

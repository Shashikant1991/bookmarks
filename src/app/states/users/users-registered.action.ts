import {ApiResponse} from '../../shared/api/api.types';
import {UsersCreateResponse} from '../../shared/api/responses/users-create.response';

export class UsersRegisteredAction {
    public static readonly type: string = '[Users] registered';

    public constructor(public registration: ApiResponse<UsersCreateResponse>) {

    }
}

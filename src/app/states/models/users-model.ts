import {ApiResponse} from '../../shared/api/api.types';
import {UsersCreateResponse} from '../../shared/api/responses/users-create.response';
import {UserEntity} from '../../shared/networks/entities/user.entity';
import {EntityIdType} from '../../shared/networks/networks.types';

export enum UsersStateEnum {
    INITIALIZING = 'initializing',
    SIGNED_IN = 'signed-in',
    SIGNED_OUT = 'signed-out'
}

export interface UsersModel {
    archive_ids: EntityIdType[];
    document_ids: EntityIdType[];
    registration: ApiResponse<UsersCreateResponse>;
    state: UsersStateEnum;
    user: UserEntity;
}

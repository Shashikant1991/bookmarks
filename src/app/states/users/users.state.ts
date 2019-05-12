import {Inject} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {DocumentsService} from '../../shared/api/documents/documents.service';
import {LogService} from '../../shared/dev-tools/log/log.service';
import {LOCAL_STORAGE} from '../../shared/dev-tools/storage/storage-token';
import {StorageService} from '../../shared/dev-tools/storage/storage.service';
import {DocumentsSortAction} from '../editor/documents/documents-sort.action';
import {UsersModel, UsersStateEnum} from '../models/users-model';
import {UsersLogoutAction} from './users-logout.action';
import {UsersRegisteredAction} from './users-registered.action';
import {UsersSessionActive} from './users-session.active';
import {UsersTokenAction} from './users-token.action';

export const USER_ID_TOKEN = 'userId';
export const USER_SESSION_TOKEN = 'session';

type UsersContext = StateContext<UsersModel>;

const DEFAULT_STATE: UsersModel = {
    archive_ids: [],
    document_ids: [],
    state: UsersStateEnum.INITIALIZING,
    user: null,
    registration: null
};

@State<UsersModel>({
    name: 'users',
    defaults: DEFAULT_STATE
})
export class UsersState {
    private readonly _log: LogService;

    public constructor(private _documents: DocumentsService,
                       @Inject(LOCAL_STORAGE) private _storage: StorageService,
                       log: LogService) {
        this._log = log.withPrefix(UsersState.name);
    }

    @Selector()
    public static archiveIds(state: UsersModel) {
        return state.archive_ids;
    }

    @Selector()
    public static documentIds(state: UsersModel) {
        return state.document_ids;
    }

    @Selector()
    public static registration(state: UsersModel) {
        return state.registration;
    }

    @Selector()
    public static state(state: UsersModel) {
        return state.state;
    }

    @Selector()
    public static user(state: UsersModel) {
        return state.user;
    }

    @Selector()
    public static userId(state: UsersModel) {
        return state.user ? state.user.id : null;
    }

    @Action(DocumentsSortAction)
    public documentsSortAction(ctx: UsersContext, {document_ids, archive_ids}: DocumentsSortAction) {
        if (document_ids) {
            ctx.patchState({document_ids});
        }
        if (archive_ids) {
            ctx.patchState({archive_ids});
        }
    }

    @Action(UsersLogoutAction)
    public usersLogoutAction(ctx: UsersContext) {
        ctx.patchState({...DEFAULT_STATE, state: UsersStateEnum.SIGNED_OUT});
        return ctx.dispatch(new UsersTokenAction(null, null));
    }

    @Action(UsersRegisteredAction)
    public usersRegisteredAction(ctx: UsersContext, {registration}: UsersRegisteredAction) {
        ctx.patchState({registration});
    }

    @Action(UsersSessionActive)
    public usersSessionActive(ctx: UsersContext, action: UsersSessionActive) {
        ctx.patchState({
            state: UsersStateEnum.SIGNED_IN,
            user: action.user,
            registration: null
        });

        // @todo I feel this can be moved to the UsersService
        if (action.remember) {
            this._storage.set(USER_ID_TOKEN, action.user.id);
            this._storage.set(USER_SESSION_TOKEN, action.user.user_session.id);
        } else {
            this._storage.remove(USER_ID_TOKEN);
            this._storage.remove(USER_SESSION_TOKEN);
        }

        return ctx.dispatch(new UsersTokenAction(action.user.id, action.user.user_session.id));
    }
}

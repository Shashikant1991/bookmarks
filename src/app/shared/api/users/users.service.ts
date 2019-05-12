import {Inject, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Navigate} from '@ngxs/router-plugin';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {catchError, first, mapTo, switchMap} from 'rxjs/operators';
import {UsersLogoutAction} from '../../../states/users/users-logout.action';
import {UsersSessionActive} from '../../../states/users/users-session.active';
import {USER_ID_TOKEN, USER_SESSION_TOKEN, UsersState} from '../../../states/users/users.state';
import {LogService} from '../../dev-tools/log/log.service';
import {LOCAL_STORAGE} from '../../dev-tools/storage/storage-token';
import {StorageService} from '../../dev-tools/storage/storage.service';
import {EntityIdType} from '../../networks/networks.types';
import {ApiResponse} from '../api.types';
import {DocumentsService} from '../documents/documents.service';
import {SessionsCreateResponse} from '../responses/sessions-create.response';
import {UsersCreateResponse} from '../responses/users-create.response';
import {RestService} from '../rest/rest.service';

@Injectable({providedIn: 'root'})
export class UsersService {
    private readonly _log: LogService;

    public constructor(private _documents: DocumentsService,
                       private _rest: RestService,
                       private _store: Store,
                       private _snackBar: MatSnackBar,
                       @Inject(LOCAL_STORAGE) private _storage: StorageService,
                       log: LogService) {
        this._log = log.withPrefix(UsersService.name);
    }

    /**
     * Activates a new user's account using a long activation code, and starts a user session.
     */
    public activateLong(activation_code: string): Observable<void> {
        return this._createSession({activation_code}, false);
    }

    /**
     * Activates a new user's account using a short activation code, and starts a user session.
     */
    public activateShort(email: string, activation_code: string): Observable<void> {
        return this._createSession({email, activation_code}, false);
    }

    /**
     * Creates a user session.
     */
    public login(email: string, password: string, remember: boolean): Observable<void> {
        return this._createSession({email, password}, remember);
    }

    /**
     * Ends a user session.
     */
    public logout(): Observable<void> {
        return this._store.select(UsersState.userId).pipe(
            first(),
            switchMap(userId => {
                if (this._storage.has(USER_ID_TOKEN)) {
                    this._storage.remove(USER_ID_TOKEN);
                }
                if (this._storage.has(USER_SESSION_TOKEN)) {
                    this._storage.remove(USER_SESSION_TOKEN);
                }
                return userId
                    ? this._rest.delete<{}>('sessions').pipe(mapTo(undefined), catchError(() => of(undefined)))
                    : of(undefined);
            })
        );
    }

    /**
     * Creates a new user's account.
     */
    public register(email: string, email_confirm: string, password: string): Observable<ApiResponse<UsersCreateResponse>> {
        return this._rest.post<UsersCreateResponse>('users', {email, email_confirm, password});
    }

    public restore() {
        if (this._storage.has(USER_ID_TOKEN) && this._storage.has(USER_SESSION_TOKEN)) {
            const userId = this._storage.get<EntityIdType>(USER_ID_TOKEN);
            const sessionId = this._storage.get<string>(USER_SESSION_TOKEN);
            this._rest.post<SessionsCreateResponse>('sessions/restore', {
                id: userId, user_session_id: sessionId
            }).subscribe(resp => {
                if (resp && resp.status === 'success') {
                    this._store.dispatch(new UsersSessionActive(resp.data.user, true));
                } else {
                    this._storage.remove(USER_ID_TOKEN);
                    this._storage.remove(USER_SESSION_TOKEN);
                    this._store.dispatch(new UsersLogoutAction());
                }
            });
        } else {
            this._store.dispatch(new UsersLogoutAction());
        }
    }

    private _createSession(body: any, remember: boolean): Observable<void> {
        return this._rest.post<SessionsCreateResponse>('sessions', body)
            .pipe(
                switchMap((resp: ApiResponse<SessionsCreateResponse>) => {
                    switch (resp && resp.status) {
                        case 'success': {
                            return this._store.dispatch(new UsersSessionActive(resp.data.user, remember));
                        }
                        case 'invalid': {
                            this._snackBar.open(
                                'The email and password you entered did not match our records. Please double-check and try again.',
                                'Dismiss'
                            );
                            break;
                        }
                        case 'suspended': {
                            this._snackBar.open(
                                'This account has been suspended. Please contact our support for more information.',
                                'Dismiss'
                            );
                            break;
                        }
                        case 'inactive': {
                            this._snackBar.open(
                                'Your account is not yet active. If you would like to receive an activation email, then fill out ' +
                                'the registration form again.',
                                'Dismiss'
                            );
                            return this._store.dispatch(new Navigate(['/users/register']));
                        }
                    }

                    return of();
                })
            );
    }
}

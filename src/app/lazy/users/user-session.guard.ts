import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot} from '@angular/router';
import {Navigate} from '@ngxs/router-plugin';
import {Select, Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {filter, switchMap, takeUntil} from 'rxjs/operators';
import {LogService} from '../../shared/dev-tools/log/log.service';
import {UsersStateEnum} from '../../states/models/users-model';
import {UsersState} from '../../states/users/users.state';

@Injectable({providedIn: 'root'})
export class UserSessionGuard implements CanActivate, CanActivateChild, OnDestroy {
    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    @Select(UsersState.state)
    private readonly _state$: Observable<UsersStateEnum>;

    @Select(UsersState.userId)
    private readonly _userId$: Observable<number>;

    public constructor(private _store: Store,
                       @Inject(DOCUMENT) private _document: Document,
                       log: LogService) {
        this._log = log.withPrefix(UserSessionGuard.name);
    }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        // this._log.debug('canActivate', next);
        return new Promise(resolver => {
            this._state$.pipe(
                filter(usersState => usersState === UsersStateEnum.SIGNED_IN || usersState === UsersStateEnum.SIGNED_OUT),
                switchMap(() => this._userId$),
                takeUntil(this._destroyed$)
            ).subscribe(userId => {
                if (!userId) {
                    const url = this._document.location.pathname + this._document.location.search;
                    this._store.dispatch(new Navigate(
                        ['/users/login'],
                        {redirect: url === '/' ? undefined : url}
                    ));
                }
                // this._log.debug('userId', userId);
                resolver(Boolean(userId));
            });
        });
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.canActivate(childRoute, state);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}

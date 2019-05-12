import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Navigate} from '@ngxs/router-plugin';
import {Store} from '@ngxs/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {UsersService} from '../../../shared/api/users/users.service';
import {AppMetaAction} from '../../../states/app/app-meta.action';
import {AppSequenceAction} from '../../../states/app/app-sequence.action';
import {UsersLogoutAction} from '../../../states/users/users-logout.action';

@Component({
    selector: 'tag-outlet-log-out',
    templateUrl: './outlet-log-out.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'animation-outlet'}
})
export class OutletLogOutComponent implements OnDestroy, OnInit {
    private readonly _destroy$: Subject<void> = new Subject();

    public constructor(private _store: Store,
                       private _users: UsersService) {
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    public ngOnInit(): void {
        this._store.dispatch(new AppMetaAction({title: 'Sign Out'}));
        this._users.logout()
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => this._store.dispatch(new AppSequenceAction([
                new UsersLogoutAction(),
                new Navigate(['/users/login'])
            ])));
    }
}

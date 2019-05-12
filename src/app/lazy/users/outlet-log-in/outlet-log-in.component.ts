import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Navigate} from '@ngxs/router-plugin';
import {Store} from '@ngxs/store';
import {BehaviorSubject, Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {UsersService} from '../../../shared/api/users/users.service';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {AppMetaAction} from '../../../states/app/app-meta.action';
import {ErrorMessages} from '../../../utils/error-messages';

@Component({
    selector: 'tag-outlet-log-in',
    templateUrl: './outlet-log-in.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'animation-outlet'}
})
export class OutletLogInComponent implements OnDestroy, OnInit {
    public busy$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public formGroup: FormGroup;

    public messages: { email: ErrorMessages; password: ErrorMessages };

    public rememberMe: boolean = true;

    private readonly _destroyed: Subject<void> = new Subject<void>();

    private readonly _log: LogService;

    public constructor(private _users: UsersService,
                       private _store: Store,
                       fb: FormBuilder,
                       log: LogService) {
        this._log = log.withPrefix(OutletLogInComponent.name);

        this.formGroup = fb.group({
            'email': ['', [Validators.required, Validators.email]],
            'password': ['', [Validators.required]]
        });

        const controls = this.formGroup.controls;
        this.messages = {
            email: new ErrorMessages(controls['email'], 'Email'),
            password: new ErrorMessages(controls['password'], 'Password')
        };
    }

    public ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }

    public ngOnInit(): void {
        this._store.dispatch(new AppMetaAction({title: 'Sign In'}));
    }

    public submit() {
        this.busy$.next(true);
        this._users.login(this.formGroup.value['email'], this.formGroup.value['password'], this.rememberMe).pipe(
            finalize(() => this.busy$.next(false)),
            takeUntil(this._destroyed)
        ).subscribe(() => {
            this._store.dispatch(new Navigate(['/']));
        });
    }
}

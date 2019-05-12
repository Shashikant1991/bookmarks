import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Navigate} from '@ngxs/router-plugin';
import {Select, Store} from '@ngxs/store';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter, finalize, first, takeUntil} from 'rxjs/operators';
import {ApiResponse} from '../../../shared/api/api.types';
import {UsersCreateResponse} from '../../../shared/api/responses/users-create.response';
import {UsersService} from '../../../shared/api/users/users.service';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {AppMetaAction} from '../../../states/app/app-meta.action';
import {UsersState} from '../../../states/users/users.state';
import {ErrorMessages} from '../../../utils/error-messages';

@Component({
    selector: 'tag-outlet-sent',
    templateUrl: './outlet-activate.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'animation-outlet'}
})
export class OutletActivateComponent implements OnDestroy, OnInit {
    public busy$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public formGroup: FormGroup;

    public messages: { [name: string]: ErrorMessages } = {};

    @Select(UsersState.registration)
    public registrations$: Observable<ApiResponse<UsersCreateResponse>>;

    private readonly _destroyed: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _users: UsersService,
                       fb: FormBuilder,
                       log: LogService) {
        this._log = log.withPrefix(OutletActivateComponent.name);

        this.registrations$
            .pipe(
                takeUntil(this._destroyed),
                filter((value) => value === null)
            )
            .subscribe(() => this._store.dispatch(new Navigate(['/users/register'])));

        this.formGroup = fb.group({
            activation_code: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        });

        const acControl = this.formGroup.controls['activation_code'];
        acControl.valueChanges
            .pipe(takeUntil(this._destroyed))
            .subscribe((value: string) => acControl.setValue(value.toUpperCase(), {onlySelf: true, emitEvent: false}));

        const controls = this.formGroup.controls;
        this.messages = {
            activation_code: new ErrorMessages(controls['activation_code'], 'Code')
        };
    }

    public ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }

    public ngOnInit(): void {
        this._store.dispatch(new AppMetaAction({title: 'Activate Account'}));
    }

    public submit() {
        this._log.debug('submit', this.formGroup.value);
        this.busy$.next(true);
        this.registrations$
            .pipe(first())
            .subscribe((registration) => {
                this._users.activateShort(
                    registration.data.email,
                    this.formGroup.value['activation_code']
                ).pipe(
                    finalize(() => this.busy$.next(false)),
                    takeUntil(this._destroyed)
                ).subscribe();
            });
    }
}

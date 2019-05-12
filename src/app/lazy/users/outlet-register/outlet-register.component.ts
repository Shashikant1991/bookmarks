import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Navigate} from '@ngxs/router-plugin';
import {Store} from '@ngxs/store';
import {BehaviorSubject, merge, Subject} from 'rxjs';
import {filter, finalize, takeUntil} from 'rxjs/operators';
import * as zxcvbn from 'zxcvbn';
import {ApiResponse} from '../../../shared/api/api.types';
import {UsersCreateResponse} from '../../../shared/api/responses/users-create.response';
import {RestService} from '../../../shared/api/rest/rest.service';
import {UsersService} from '../../../shared/api/users/users.service';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {AppValidatorsService} from '../../../shared/form-utils/app-validators/app-validators.service';
import {PasswordStrengthValidator} from '../../../shared/passwords/password-strength-validator';
import {AppMetaAction} from '../../../states/app/app-meta.action';
import {UsersRegisteredAction} from '../../../states/users/users-registered.action';
import {ErrorMessages} from '../../../utils/error-messages';

@Component({
    selector: 'tag-outlet-register',
    templateUrl: './outlet-register.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'animation-outlet'}
})
export class OutletRegisterComponent implements OnDestroy, OnInit {
    public busy$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public formGroup: FormGroup;

    public messages: { email: ErrorMessages; confirm_email: ErrorMessages; password: ErrorMessages };

    public readonly passwordStrength: PasswordStrengthValidator;

    private readonly _destroyed: Subject<void> = new Subject<void>();

    private readonly _log: LogService;

    public constructor(private _rest: RestService,
                       private _change: ChangeDetectorRef,
                       private _store: Store,
                       private _snackBar: MatSnackBar,
                       private _usersService: UsersService,
                       appValidators: AppValidatorsService,
                       fb: FormBuilder,
                       log: LogService) {
        this._log = log.withPrefix(OutletRegisterComponent.name);

        const email = new FormControl('', [
            Validators.email,
            Validators.required,
            Validators.maxLength(255)
        ]);

        const confirm_email = new FormControl('', [
            Validators.required,
            appValidators.mustEqual(email)
        ]);

        this.passwordStrength = new PasswordStrengthValidator(this._usersService, log);

        const password = new FormControl('', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(255),
            appValidators.mustNotEqual(email),
            appValidators.otherHasValue(email),
            this.passwordStrength.validator(email)
        ]);

        this.formGroup = fb.group({email, confirm_email, password});

        merge(email.valueChanges, confirm_email.valueChanges, password.valueChanges)
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => {
                [email, confirm_email, password].forEach((c: AbstractControl) => c.updateValueAndValidity({
                    onlySelf: true,
                    emitEvent: false
                }));
                this._change.markForCheck();
            });

        const controls = this.formGroup.controls;
        this.messages = {
            email: new ErrorMessages(controls['email'], 'Email'),
            confirm_email: new ErrorMessages(controls['confirm_email'], 'Confirm email')
                .set('mustEqual', 'Confirm email does not match'),
            password: new ErrorMessages(controls['password'], 'Password')
                .set('mustNotEqual', 'Password can not match email')
                .set('otherHasValue', 'Password requires a valid email')
                .set('passwordStrength', (result: zxcvbn.ZXCVBNResult) => {
                    return result.feedback.warning;
                })
        };
    }

    public ngOnDestroy(): void {
        this.passwordStrength.ngOnDestroy();
        this._destroyed.next();
        this._destroyed.complete();
    }

    public ngOnInit(): void {
        this._store.dispatch(new AppMetaAction({title: 'Registration'}));
    }

    public submit() {
        this._log.debug('submit', this.formGroup.value);
        this.busy$.next(true);
        this._usersService.register(
            this.formGroup.value['email'],
            this.formGroup.value['email_confirm'],
            this.formGroup.value['password']
        )
            .pipe(
                finalize(() => this.busy$.next(false)),
                filter((resp) => Boolean(resp)),
                takeUntil(this._destroyed)
            )
            .subscribe((response: ApiResponse<UsersCreateResponse>) => {
                this._log.debug(response);
                if (response.status !== 'active') {
                    this._store.dispatch(new UsersRegisteredAction(response)).subscribe(() => {
                        this._store.dispatch(new Navigate(['/users/activate']));
                    });
                } else {
                    this._snackBar.open('Your account is already active. Please reset your password', 'Dismiss');
                    this._store.dispatch(new Navigate(['/users/reset']));
                }
            });
    }

}

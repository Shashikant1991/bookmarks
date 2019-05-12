import {OnDestroy} from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import * as zxcvbn from 'zxcvbn';
import {Objects} from '../../utils/objects';
import {UsersService} from '../api/users/users.service';
import {LogService} from '../dev-tools/log/log.service';

export class PasswordStrengthValidator implements OnDestroy {
    private readonly _cache: Map<string, Map<string, zxcvbn.ZXCVBNResult>> = new Map();

    private readonly _destroyed: Subject<void> = new Subject();

    private readonly _log: LogService;

    private readonly _results: ReplaySubject<zxcvbn.ZXCVBNResult> = new ReplaySubject<zxcvbn.ZXCVBNResult>(1);

    public constructor(private _usersService: UsersService,
                       log: LogService) {
        this._log = log.withPrefix(PasswordStrengthValidator.name);
    }

    public get scope(): Observable<number> {
        return this._results.pipe(map((result) => result.score));
    }

    public get suggestions(): Observable<string[]> {
        return this._results.pipe(map((result) => result.feedback.suggestions));
    }

    private static errors(name: string, result: zxcvbn.ZXCVBNResult, minScore: number = 1) {
        return result.score <= minScore ? Objects.set({}, name, result) : null;
    }

    public ngOnDestroy(): void {
        this._cache.clear();
        this._destroyed.next();
        this._destroyed.complete();
    }

    public validator(emailControl: AbstractControl, minScore: number = 1, name: string = 'passwordStrength'): ValidatorFn {
        return (c: AbstractControl): ValidationErrors | null => {
            const email = emailControl.value;
            const cache = this.getCache(email);
            if (cache.has(c.value)) {
                return this.readCache(cache, c.value, name, minScore);
            }
            const result = zxcvbn(c.value, [email]);
            this._log.debug('result', result);
            this._results.next(result);
            return PasswordStrengthValidator.errors(name, result, minScore);
        };
    }

    private getCache(email: string): Map<string, zxcvbn.ZXCVBNResult> {
        if (!this._cache.has(email)) {
            this._cache.set(email, new Map());
        }
        return this._cache.get(email);
    }

    private readCache(cache: Map<string, zxcvbn.ZXCVBNResult>, value: string, name: string, minScore: number): ValidationErrors | null {
        const result = cache.get(value);
        this._log.debug('cached', result);
        this._results.next(result);
        return PasswordStrengthValidator.errors(name, result, minScore);
    }
}

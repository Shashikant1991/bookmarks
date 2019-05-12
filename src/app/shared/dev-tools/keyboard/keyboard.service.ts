import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, fromEvent, merge, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, filter, takeUntil} from 'rxjs/operators';
import {LogService} from '../log/log.service';

@Injectable({
    providedIn: 'root'
})
export class KeyboardService implements OnDestroy {

    public readonly alt$: Observable<boolean>;

    public readonly ctrl$: Observable<boolean>;

    public readonly esc$: Observable<void>;

    public readonly shift$: Observable<boolean>;

    private readonly _alt$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private readonly _ctrl$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _esc$: Subject<void> = new Subject();

    private readonly _log: LogService;

    private readonly _shift$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public constructor(@Inject(DOCUMENT) private _doc: Document,
                       log: LogService) {
        this._log = log.withPrefix(KeyboardService.name);

        merge(fromEvent<KeyboardEvent>(_doc, 'keydown'), fromEvent<KeyboardEvent>(_doc, 'keyup'))
            .pipe(takeUntil(this._destroyed$))
            .subscribe(event => {
                this._ctrl$.next(Boolean(event.ctrlKey));
                this._alt$.next(Boolean(event.altKey));
                this._shift$.next(Boolean(event.shiftKey));
            });

        fromEvent(window, 'blur')
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                this._ctrl$.next(false);
                this._alt$.next(false);
                this._shift$.next(false);
            });

        fromEvent<KeyboardEvent>(_doc, 'keyup').pipe(
            filter(event => typeof event.key === 'string' && (event.key.toUpperCase() === 'ESCAPE' || event.key.toUpperCase() === 'ESC')),
            takeUntil(this._destroyed$)
        ).subscribe(() => this._esc$.next());

        this.ctrl$ = this._ctrl$.pipe(distinctUntilChanged());
        this.alt$ = this._alt$.pipe(distinctUntilChanged());
        this.shift$ = this._shift$.pipe(distinctUntilChanged());
        this.esc$ = this._esc$.asObservable();
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}

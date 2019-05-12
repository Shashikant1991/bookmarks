import {ElementRef, Injectable, OnDestroy, ViewContainerRef} from '@angular/core';
import {Store} from '@ngxs/store';
import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs';
import {delay, distinctUntilChanged, filter, map, pairwise, skip, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {ReactiveTool, ReactiveToolAnimate, ReactiveToolDisabled, ReactiveToolStyle} from '../../../shared/reactive-tools/reactive-tool';
import {AppState} from '../../../states/app/app.state';
import {ChangesState} from '../../../states/changes/changes.state';
import {SelectionsState} from '../../../states/editor/selections/selections.state';
import {distinctStringify} from '../../../utils/operators/distinct-stringify';
import {
    REFRESH_TOOL_DEFAULT,
    REFRESH_TOOL_READ,
    REFRESH_TOOL_SUCCESS,
    REFRESH_TOOL_WRITE,
    SAVE_CHANGES_FATAL_ERROR,
    TopBarRefreshState
} from '../top-bar-refresh-types';

@Injectable()
export class GeneralRefreshService implements ReactiveTool, ReactiveToolAnimate, ReactiveToolDisabled, ReactiveToolStyle, OnDestroy {
    public readonly order: string = '0100:0200';

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    private readonly _states$: Observable<TopBarRefreshState>;

    private readonly _statesNext$: BehaviorSubject<TopBarRefreshState> = new BehaviorSubject(REFRESH_TOOL_DEFAULT);

    public constructor(private _store: Store,
                       log: LogService) {
        this._log = log.withPrefix(GeneralRefreshService.name);

        combineLatest(
            this._store.select(AppState.networkRead),
            this._store.select(AppState.networkWrite)
        ).pipe(
            distinctStringify(),
            pairwise(),
            takeUntil(this._destroyed$)
        ).subscribe(([previous, current]) => {
            const [read, write] = current;
            if (write) {
                this._statesNext$.next(REFRESH_TOOL_WRITE);
            } else if (read) {
                this._statesNext$.next(REFRESH_TOOL_READ);
            } else {
                const [previousRead, previousWrite] = previous;
                if (previousRead && !previousWrite) {
                    this._statesNext$.next(REFRESH_TOOL_DEFAULT);
                } else {
                    this._statesNext$.next(REFRESH_TOOL_SUCCESS);
                }
            }
        });

        this._statesNext$.pipe(
            filter(value => value === REFRESH_TOOL_SUCCESS),
            switchMap(() => of(REFRESH_TOOL_DEFAULT).pipe(
                delay(2000),
                takeUntil(this._statesNext$.pipe(skip(1)))
            )),
            takeUntil(this._destroyed$)
        ).subscribe(value => this._statesNext$.next(value));

        this._states$ = this._statesNext$.pipe(
            withLatestFrom(this._store.select(ChangesState.fatalError)),
            map(([state, fatalError]) => {
                if (state === REFRESH_TOOL_SUCCESS) {
                    return state;
                }
                if (fatalError) {
                    if (state === REFRESH_TOOL_DEFAULT) {
                        return SAVE_CHANGES_FATAL_ERROR;
                    }
                    return {...state, color: 'danger'} as TopBarRefreshState;
                }
                return state;
            })
        );
    }

    public animate(): Observable<string> {
        return this._states$.pipe(map(state => state.animate), distinctUntilChanged());
    }

    public color(): Observable<'success' | 'warning' | 'danger' | 'info' | void> {
        return this._states$.pipe(map(state => state.color), distinctUntilChanged());
    }

    public disabled(): Observable<boolean> {
        const disabled$ = this._states$.pipe(map(state => Boolean(state.disabled)), distinctUntilChanged());
        return combineLatest(
            disabled$,
            this._store.select(SelectionsState.someSelected)
        ).pipe(map(([disabled, selected]) => disabled || selected));
    }

    public highlight(): Observable<boolean> {
        return of(false);
    }

    public icon(): Observable<string> {
        return this._states$.pipe(map(state => state.icon), distinctUntilChanged());
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public title(): Observable<string> {
        return this._states$.pipe(map(state => state.title), distinctUntilChanged());
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }
}

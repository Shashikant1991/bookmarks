import {Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngxs/store';
import {Subject} from 'rxjs';
import {debounceTime, filter, takeUntil} from 'rxjs/operators';
import {ChangesSendAction} from '../../../states/changes/changes-send.action';
import {ChangesState} from '../../../states/changes/changes.state';
import {ChangesModel} from '../../../states/models/changes-model';
import {LogService} from '../../dev-tools/log/log.service';

@Injectable({providedIn: 'root'})
export class ChangesService implements OnDestroy {
    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       log: LogService) {
        this._log = log.withPrefix(ChangesService.name);
    }

    public initialize(delayMs: number = 500) {
        this._store.select(ChangesState).pipe(
            filter((state: ChangesModel) =>
                state.error === null
                && state.sending === null
                && state.queued
                && Boolean(state.queued.length)
            ),
            debounceTime(delayMs),
            takeUntil(this._destroyed$)
        ).subscribe(() => this._store.dispatch(new ChangesSendAction()));
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}

import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Select} from '@ngxs/store';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter, map, pairwise, takeUntil} from 'rxjs/operators';
import {EntityChange} from '../../../shared/networks/networks.types';
import {ChangesState} from '../../../states/changes/changes.state';

@Component({
    selector: 'tag-debug-side-bar',
    templateUrl: './debug-side-bar.component.html',
    styleUrls: ['./debug-side-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebugSideBarComponent implements OnInit, OnDestroy {
    @Select(ChangesState.queued)
    public queued$: Observable<EntityChange[]>;

    @Select(ChangesState.sending)
    public sending$: Observable<EntityChange[]>;

    public sent$: BehaviorSubject<EntityChange[]> = new BehaviorSubject([]);

    private readonly _destroyed$: Subject<void> = new Subject();

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this.sending$.pipe(
            pairwise(),
            map(([a, b]) => a),
            filter(Boolean),
            takeUntil(this._destroyed$)
        ).subscribe(changes => this.sent$.next([...changes, ...this.sent$.getValue()].slice(0, 100)));
    }
}

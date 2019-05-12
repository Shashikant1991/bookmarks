import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {first, switchMap} from 'rxjs/operators';
import {AppState} from '../../../states/app/app.state';
import {DocumentsSortAction} from '../../../states/editor/documents/documents-sort.action';
import {LogService} from '../../dev-tools/log/log.service';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-document-list',
    templateUrl: './document-list.component.html',
    styleUrls: ['./document-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.reactive-tool-side-bar]': 'true',
        '[class.reactive-tool-invert]': 'true'
    }
})
export class DocumentListComponent implements OnInit, OnDestroy {
    public readonly archived$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    @Select(AppState.documentIds)
    public documentIds$: Observable<EntityIdType[]>;

    public ids$: Observable<EntityIdType[]>;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       log: LogService) {
        this._log = log.withPrefix(DocumentListComponent.name);
    }

    @Input()
    public set archived(archived: boolean) {
        this.archived$.next(archived);
    }

    drop(event: CdkDragDrop<EntityIdType[]>, ids: EntityIdType[]) {
        ids = ids.slice();
        moveItemInArray(ids, event.previousIndex, event.currentIndex);
        this.archived$.pipe(first()).subscribe(archived => {
            const document_ids = archived ? undefined : ids;
            const archive_ids = archived ? ids : undefined;
            this._store.dispatch(new DocumentsSortAction(document_ids, archive_ids));
        });
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this.ids$ = this.archived$.pipe(
            switchMap(archived => {
                return archived
                    ? this._store.select(AppState.archiveIds)
                    : this._store.select(AppState.documentIds);
            })
        );
    }
}

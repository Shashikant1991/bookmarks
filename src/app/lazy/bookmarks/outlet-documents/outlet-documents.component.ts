import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngxs/store';
import {BehaviorSubject, merge, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DocumentsService} from '../../../shared/api/documents/documents.service';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {FeatureLoaderState} from '../../../shared/loaders/feature-loader-types';

@Component({
    selector: 'tag-outlet-documents',
    templateUrl: './outlet-documents.component.html',
    styleUrls: ['./outlet-documents.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletDocumentsComponent implements OnInit, OnDestroy {
    public loader$: BehaviorSubject<FeatureLoaderState> = new BehaviorSubject(null);

    private readonly _cancel$: Subject<void> = new Subject();

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _documents: DocumentsService,
                       private _activatedRoute: ActivatedRoute,
                       log: LogService) {
        this._log = log.withPrefix(OutletDocumentsComponent.name);
    }

    public loadDocuments() {
        this.loader$.next({type: 'busy'});
        this._cancel$.next();

        this._documents.all().pipe(
            takeUntil(merge(this._cancel$, this._destroyed$))
        ).subscribe(resp => {
            if (resp && resp.status === 'success') {
                this.loader$.next(null);
                // this._store.dispatch(new EditorSetDocumentAction(resp.data));
            } else {
                this.loader$.next({type: 'error', canRetry: true, message: 'Could not load bookmarks'});
            }
        });
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this.loadDocuments();
    }
}

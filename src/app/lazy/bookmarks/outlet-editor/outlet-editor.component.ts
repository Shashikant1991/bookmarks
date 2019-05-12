import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {BehaviorSubject, merge, Observable, Subject} from 'rxjs';
import {map, switchMap, takeUntil} from 'rxjs/operators';
import {DocumentsService} from '../../../shared/api/documents/documents.service';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {FeatureLoaderState} from '../../../shared/loaders/feature-loader-types';
import {DocumentEntity} from '../../../shared/networks/entities/document.entity';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {AppMetaAction} from '../../../states/app/app-meta.action';
import {EditorSetDocumentAction} from '../../../states/editor/editor-set-document.action';
import {EditorState} from '../../../states/editor/editor.state';

@Component({
    selector: 'tag-outlet-editor',
    templateUrl: './outlet-editor.component.html',
    styleUrls: ['./outlet-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletEditorComponent implements OnInit, OnDestroy {
    @Select(EditorState.document)
    public document$: Observable<DocumentEntity>;

    public documentId$: Observable<EntityIdType>;

    public loader$: BehaviorSubject<FeatureLoaderState> = new BehaviorSubject(null);

    private readonly _cancel$: Subject<void> = new Subject();

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _documents: DocumentsService,
                       private _activatedRoute: ActivatedRoute,
                       log: LogService) {
        this._log = log.withPrefix(OutletEditorComponent.name);
    }

    public loadDocument() {
        this.loader$.next({type: 'busy'});
        this._cancel$.next();
        this.documentId$.pipe(
            switchMap(documentId => this._documents.get(documentId)),
            takeUntil(merge(this._cancel$, this._destroyed$))
        ).subscribe(resp => {
            if (resp && resp.status === 'success') {
                this.loader$.next(null);
                this._store.dispatch(new EditorSetDocumentAction(resp.data));
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
        this.documentId$ = this._activatedRoute.params.pipe(map(params => parseInt(params['documentId'] || '1', 10)));
        this.loadDocument();

        this._store.select(EditorState.document).pipe(
            map((document: DocumentEntity) => document && document.title),
            takeUntil(this._destroyed$)
        ).subscribe(title => this._store.dispatch(new AppMetaAction({title: title || 'Loading'})));
    }
}

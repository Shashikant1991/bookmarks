import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Navigate} from '@ngxs/router-plugin';
import {Select, Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {filter, map, switchMap, takeUntil} from 'rxjs/operators';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {DocumentEntity} from '../../../shared/networks/entities/document.entity';
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

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _activatedRoute: ActivatedRoute,
                       log: LogService) {
        this._log = log.withPrefix(OutletEditorComponent.name);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this._activatedRoute.params.pipe(
            map(params => parseInt(params['documentId'] || '1', 10)),
            switchMap(document_id => this._store.dispatch(new EditorSetDocumentAction(document_id))),
            takeUntil(this._destroyed$)
        ).subscribe(() => {
        }, () => {
            this._store.dispatch(new Navigate(['/']));
        });

        this._store.select(EditorState.document).pipe(
            filter(Boolean),
            map(doc => doc.title || 'Blank Document'),
            takeUntil(this._destroyed$)
        ).subscribe(title => this._store.dispatch(new AppMetaAction({title})));
    }
}

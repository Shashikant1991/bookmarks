import {moveItemInArray} from '@angular/cdk/drag-drop';
import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {combineLatest, Observable, of} from 'rxjs';
import {first, map, withLatestFrom} from 'rxjs/operators';
import {AppState} from '../../../states/app/app.state';
import {DocumentsSortAction} from '../../../states/editor/documents/documents-sort.action';
import {LogService} from '../../dev-tools/log/log.service';
import {EntityIdType} from '../../networks/networks.types';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolDisabled} from '../../reactive-tools/reactive-tool';
import {ReactiveToolContext} from '../../reactive-tools/reactive-tool-context';
import {DocumentContext} from './document-context.service';

@Injectable()
export abstract class DocumentMoveService implements ReactiveTool, ReactiveToolDisabled {
    public readonly abstract config: Partial<ReactiveToolConfig>;

    protected readonly _archived$: Observable<boolean>;

    protected readonly _document_id$: Observable<EntityIdType>;

    protected readonly _ids$: Observable<EntityIdType[]>;

    protected readonly disabled$: Observable<boolean>;

    protected constructor(protected readonly _store: Store,
                          protected readonly _context: DocumentContext,
                          protected readonly _direction: 'up' | 'down',
                          protected readonly _log: LogService) {
        const document_ids$ = this._store.select(AppState.documentIds);
        const archived_ids$ = this._store.select(AppState.archiveIds);

        this._document_id$ = _context.getDocumentId();
        this._archived$ = _context.getDocument().pipe(map(document => document.archived));
        this._ids$ = combineLatest(document_ids$, archived_ids$).pipe(
            withLatestFrom(this._archived$, ([document_ids, archived_ids], archived) => archived ? archived_ids : document_ids)
        );

        this.disabled$ = this._ids$.pipe(
            withLatestFrom(this._document_id$),
            map(([ids, document_id]) => {
                if (ids.length) {
                    const indx = _direction === 'up' ? 0 : ids.length - 1;
                    return ids[indx] === document_id;
                }
                return true;
            })
        );
    }

    public disabled(): Observable<boolean> {
        return this.disabled$;
    }

    public icon(): Observable<string> {
        return of(this._direction === 'up' ? 'angle-up' : 'angle-down');
    }

    public title(): Observable<string> {
        return of(`Move ${this._direction}`);
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger(context?: ReactiveToolContext) {
        combineLatest(this._archived$, this._document_id$, this._ids$)
            .pipe(first())
            .subscribe(([archived, document_id, ids]: [boolean, EntityIdType, EntityIdType[]]) => {
                const indx = ids.indexOf(document_id);
                const arr = [...ids];
                moveItemInArray(arr, indx, this._direction === 'up' ? indx - 1 : indx + 1);
                this._store.dispatch(new DocumentsSortAction(
                    archived ? undefined : arr,
                    archived ? arr : undefined
                ));
            });
    }
}

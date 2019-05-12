import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {map, mapTo, switchMap} from 'rxjs/operators';
import {DocumentsFailedAction} from '../../states/editor/documents/documents-failed.action';
import {DocumentsSetAction} from '../../states/editor/documents/documents-set.action';
import {DocumentsService} from '../api/documents/documents.service';
import {LogService} from '../dev-tools/log/log.service';
import {DocumentEntity} from '../networks/entities/document.entity';

@Injectable({providedIn: 'root'})
export class DocumentsResolver implements Resolve<DocumentEntity[]> {
    private readonly _log: LogService;

    public constructor(private _documents: DocumentsService,
                       private _store: Store,
                       log: LogService) {
        this._log = log.withPrefix(DocumentsResolver.name);
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DocumentEntity[]> {
        return this._documents.all().pipe(
            map(resp => resp && resp.status === 'success' ? resp.data : null),
            switchMap(documents => {
                if (documents && documents.length === 0) {
                    return this._documents.create().pipe(
                        map(resp => resp && resp.status === 'success' ? [resp.data] : null)
                    );
                }
                return of(documents);
            }),
            switchMap(documents => {
                return this._store.dispatch(documents === null
                    ? new DocumentsFailedAction()
                    : new DocumentsSetAction(documents)
                ).pipe(mapTo(documents || []));
            })
        );
    }
}

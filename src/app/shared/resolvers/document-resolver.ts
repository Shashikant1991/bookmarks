import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {mapTo, switchMap} from 'rxjs/operators';
import {EditorSetDocumentAction} from '../../states/editor/editor-set-document.action';
import {RouteSnapshot} from '../../utils/route-snap-shot';
import {DocumentsService} from '../api/documents/documents.service';
import {LogService} from '../dev-tools/log/log.service';

/**
 * @deprecated
 */
@Injectable({providedIn: 'root'})
export class DocumentResolver implements Resolve<boolean> {
    private readonly _log: LogService;

    public constructor(private _documents: DocumentsService,
                       private _store: Store,
                       log: LogService) {
        this._log = log.withPrefix(DocumentResolver.name);
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const documentId = RouteSnapshot.getNumberOrFail(route, 'documentId');
        this._log.debug('resolve', {documentId});
        return this._documents.get(documentId).pipe(
            switchMap((resp) => {
                this._log.debug('response', resp);
                if (resp && resp.status === 'success') {
                    return this._store.dispatch(new EditorSetDocumentAction(resp.data)).pipe(mapTo(true));
                } else {
                    // @todo Need to handle a failure here.
                    return of(false);
                }
            })
        );
    }
}

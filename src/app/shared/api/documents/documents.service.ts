import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LogService} from '../../dev-tools/log/log.service';
import {DocumentEntity, DocumentResponse} from '../../networks/entities/document.entity';
import {TemplateEntity} from '../../networks/entities/template.entity';
import {EntityChange, EntityIdType} from '../../networks/networks.types';
import {ApiResponse} from '../api.types';
import {RestService} from '../rest/rest.service';

@Injectable({providedIn: 'root'})
export class DocumentsService {
    private readonly _log: LogService;

    public constructor(private _rest: RestService,
                       log: LogService) {
        this._log = log.withPrefix(DocumentsService.name);
    }

    /**
     * Gets all the documents.
     */
    public all(): Observable<ApiResponse<DocumentEntity[]>> {
        return this._rest.get<DocumentEntity[]>('documents');
    }

    /**
     * Sends a collection of changes to be applied to the document.
     */
    public changes(changes: EntityChange[]): Observable<ApiResponse<void>> {
        return this._rest.post<void>(`changes`, changes);
    }

    public create(template?: string): Observable<ApiResponse<DocumentEntity>> {
        return this._rest.post<DocumentEntity>(`documents`, {template});
    }

    /**
     * Creates a new document.
     *
     * @deprecated
     */
    public create_old(documentId: EntityIdType, order: number): Observable<ApiResponse<DocumentEntity>> {
        return this._rest.post<DocumentEntity>(`documents/${documentId}`, {order});
    }

    /**
     * Gets a single document
     */
    public get(documentId: EntityIdType): Observable<ApiResponse<DocumentResponse>> {
        return this._rest.get<DocumentResponse>(`documents/${documentId}`);
    }

    public templates(): Observable<ApiResponse<TemplateEntity[]>> {
        return this._rest.get<TemplateEntity[]>('templates');
    }
}

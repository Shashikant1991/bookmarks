import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable, ReplaySubject} from 'rxjs';
import {filter, first, map, switchMap} from 'rxjs/operators';
import {LabelEntity} from '../../../shared/networks/entities/label.entity';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {DocumentsState} from '../../../states/storage/documents/documents.state';

@Injectable()
export class LabelEditContext {
    private _labelId$: ReplaySubject<EntityIdType> = new ReplaySubject(1);

    public constructor(private _store: Store) {
    }

    public getLabel(): Observable<LabelEntity> {
        return this._labelId$.pipe(
            switchMap(documentId => this._store.select(DocumentsState.byId).pipe(map(selector => selector(documentId)))),
            filter(Boolean)
        );
    }

    public getLabelId(): Observable<EntityIdType> {
        return this._labelId$.asObservable();
    }

    public getLabelIdOnce(): Observable<EntityIdType> {
        return this._labelId$.pipe(first());
    }

    public getLabelOnce(): Observable<LabelEntity> {
        return this.getLabel().pipe(first());
    }

    public setLabelId(labelId: EntityIdType) {
        this._labelId$.next(labelId);
    }
}

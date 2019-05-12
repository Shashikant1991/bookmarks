import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {map, mapTo, switchMap} from 'rxjs/operators';
import {LabelsFailedAction} from '../../states/editor/labels/labels-failed.action';
import {LabelsSetAction} from '../../states/editor/labels/labels-set.action';
import {LabelsService} from '../api/labels/labels.service';
import {LogService} from '../dev-tools/log/log.service';
import {LabelEntity} from '../networks/entities/label.entity';

@Injectable({providedIn: 'root'})
export class LabelsResolver implements Resolve<LabelEntity[]> {
    private readonly _log: LogService;

    public constructor(private _labels: LabelsService,
                       private _store: Store,
                       log: LogService) {
        this._log = log.withPrefix(LabelsResolver.name);
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LabelEntity[]> {
        return this._labels.all().pipe(
            map(resp => resp && resp.status === 'success' ? resp.data : null),
            switchMap((labels: LabelEntity[]) => {
                return this._store.dispatch(labels === null
                    ? new LabelsFailedAction()
                    : new LabelsSetAction(labels)
                ).pipe(mapTo(labels || []));
            })
        );
    }
}

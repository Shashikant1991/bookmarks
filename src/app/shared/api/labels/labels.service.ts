import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LogService} from '../../dev-tools/log/log.service';
import {LabelEntity} from '../../networks/entities/label.entity';
import {ApiResponse} from '../api.types';
import {RestService} from '../rest/rest.service';

@Injectable({providedIn: 'root'})
export class LabelsService {
    private readonly _log: LogService;

    public constructor(private _rest: RestService,
                       log: LogService) {
        this._log = log.withPrefix(LabelsService.name);
    }

    public all(): Observable<ApiResponse<LabelEntity[]>> {
        return this._rest.get<LabelEntity[]>('labels');
    }
}

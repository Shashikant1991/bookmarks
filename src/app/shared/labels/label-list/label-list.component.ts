import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {Store} from '@ngxs/store';
import {Subject} from 'rxjs';
import {LogService} from '../../dev-tools/log/log.service';
import {LabelEditService} from '../label-tools/label-edit.service';

@Component({
    selector: 'tag-label-list',
    templateUrl: './label-list.component.html',
    styleUrls: ['./label-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelListComponent implements OnDestroy {
    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       public editLabel: LabelEditService,
                       log: LogService) {
        this._log = log.withPrefix(LabelListComponent.name);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}

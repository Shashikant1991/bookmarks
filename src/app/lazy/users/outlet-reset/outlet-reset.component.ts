import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Store} from '@ngxs/store';
import {BehaviorSubject} from 'rxjs';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {AppMetaAction} from '../../../states/app/app-meta.action';

interface ResetFormData {
    email: string;
}

@Component({
    selector: 'tag-outlet-reset',
    templateUrl: './outlet-reset.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'animation-outlet'}
})
export class OutletResetComponent implements OnInit {
    public busy$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public data: ResetFormData = {email: ''};

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       log: LogService) {
        this._log = log.withPrefix(OutletResetComponent.name);
    }

    public ngOnInit(): void {
        this._store.dispatch(new AppMetaAction({title: 'Reset Password'}));
    }

    public submit() {

    }
}

import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {first, map, switchMap} from 'rxjs/operators';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {LabelEntity} from '../../../shared/networks/entities/label.entity';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {LabelsState} from '../../../states/storage/labels/labels.state';
import {LabelEditContext} from '../label-tools/label-edit-context';
import {LABEL_EDIT_PROVIDERS} from '../label-tools/label-providers';

@Component({
    selector: 'tag-label-edit',
    templateUrl: './label-edit.component.html',
    styleUrls: ['./label-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(click)': 'click($event)'
    },
    providers: [
        LabelEditContext,
        ...LABEL_EDIT_PROVIDERS
    ]
})
export class LabelEditComponent implements OnInit, OnDestroy {
    public label$: Observable<LabelEntity>;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _labelId$: ReplaySubject<EntityIdType> = new ReplaySubject(1);

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _router: Router,
                       public el: ElementRef<HTMLElement>,
                       log: LogService) {
        this._log = log.withPrefix(LabelEditComponent.name);
    }

    @Input()
    public set labelId(labelId: EntityIdType) {
        this._labelId$.next(labelId);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
    public click(event: MouseEvent) {
        this.label$.pipe(first()).subscribe(label => this._router.navigate([`/labels/${label.id}`]));
    }

    public ngOnInit(): void {
        this.label$ = this._labelId$.pipe(
            switchMap(labelId => this._store.select(LabelsState.byId).pipe(map(selector => selector(labelId))))
        );
    }
}

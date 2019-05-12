import {Attribute, ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable, ReplaySubject} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {LabelsState} from '../../../states/editor/labels/labels.state';
import {LabelEntity} from '../../networks/entities/label.entity';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-label-tag',
    templateUrl: './label-tag.component.html',
    styleUrls: ['./label-tag.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelTagComponent implements OnInit {
    public label$: Observable<LabelEntity>;

    private readonly _labelId$: ReplaySubject<EntityIdType> = new ReplaySubject(1);

    public constructor(private _store: Store,
                       @Attribute('mode') public mode: 'card' | 'document') {
        this.mode = this.mode || 'card';
    }

    @Input()
    public set labelId(labelId: EntityIdType) {
        this._labelId$.next(labelId);
    }

    public ngOnInit() {
        this.label$ = this._labelId$.pipe(
            switchMap(labelId => this._store.select(LabelsState.byId).pipe(map(selector => selector(labelId))))
        );
    }
}

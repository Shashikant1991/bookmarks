import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {SideBarBackground, SideBarComponentStyle} from '../../../shared/side-bars/side-bars.types';
import {LabelsState} from '../../../states/editor/labels/labels.state';

@Component({
    selector: 'tag-labels-side-bar',
    templateUrl: './labels-side-bar.component.html',
    styleUrls: ['./labels-side-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelsSideBarComponent implements OnDestroy, SideBarComponentStyle {
    @Select(LabelsState.labelIds)
    public labelIds$: Observable<EntityIdType[]>;

    private readonly _destroyed$: Subject<void> = new Subject();

    // public constructor(@Inject(LABEL_TOOLS) public tools: ReactiveTool[]) {
    //
    // }

    public getBackground(): SideBarBackground {
        return 'lite';
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}

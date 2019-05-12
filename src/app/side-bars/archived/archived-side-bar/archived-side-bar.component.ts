import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable} from 'rxjs';
import {EntityIdType} from '../../../shared/networks/networks.types';
import {SideBarBackground, SideBarComponentStyle} from '../../../shared/side-bars/side-bars.types';
import {AppState} from '../../../states/app/app.state';

@Component({
    selector: 'tag-archived-side-bar',
    templateUrl: './archived-side-bar.component.html',
    styleUrls: ['./archived-side-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchivedSideBarComponent implements SideBarComponentStyle {
    @Select(AppState.documentIds)
    public documentIds$: Observable<EntityIdType[]>;

    public getBackground(): SideBarBackground {
        return 'lite';
    }
}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PanelsModule} from '../../shared/panels/panels.module';
import {SideBarsModule} from '../../shared/side-bars/side-bars.module';
import {LabelEditFormComponent} from './label-edit-form/label-edit-form.component';
import {LabelEditComponent} from './label-edit/label-edit.component';
import {LABEL_PROVIDERS} from './label-tools/label-providers';
import {LABELS_SIDE_BAR_TOKEN} from './labels-side-bar.token';
import {LabelsSideBarComponent} from './labels-side-bar/labels-side-bar.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SideBarsModule,
        PanelsModule
    ],
    declarations: [
        LabelEditFormComponent,
        LabelEditComponent,
        LabelsSideBarComponent
    ],
    providers: [
        {provide: LABELS_SIDE_BAR_TOKEN, useValue: LabelsSideBarComponent},
        ...LABEL_PROVIDERS
    ],
    entryComponents: [
        LabelsSideBarComponent
    ]
})
export class LabelsModule {
}

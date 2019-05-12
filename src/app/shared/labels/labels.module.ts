import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ColorsModule} from '../colors/colors.module';
import {ReactiveToolsModule} from '../reactive-tools/reactive-tools.module';
import {LabelListComponent} from './label-list/label-list.component';
import {LabelTagComponent} from './label-tag/label-tag.component';
import {LabelTagsComponent} from './label-tags/label-tags.component';
import {LabelEditService} from './label-tools/label-edit.service';

@NgModule({
    imports: [
        CommonModule,
        ColorsModule,
        // UiModule,
        FontAwesomeModule,
        ReactiveToolsModule,
    ],
    declarations: [
        LabelListComponent,
        LabelTagComponent,
        LabelTagsComponent
    ],
    providers: [
        // ...LABEL_PROVIDERS
        LabelEditService
    ],
    exports: [
        LabelListComponent,
        LabelTagsComponent
    ]
})
export class LabelsModule {
}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {HelpRoutingModule} from './help-routing.module';
import {OutletHelpComponent} from './outlet-help/outlet-help.component';
import { OutletFeedbackComponent } from './outlet-feedback/outlet-feedback.component';

@NgModule({
    imports: [
        CommonModule,
        HelpRoutingModule
    ],
    declarations: [
        OutletHelpComponent,
        OutletFeedbackComponent
    ]
})
export class HelpModule {
}

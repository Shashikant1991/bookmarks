import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {HelpRoutingModule} from './help-routing.module';
import {OutletHelpComponent} from './outlet-help/outlet-help.component';

@NgModule({
    imports: [
        CommonModule,
        HelpRoutingModule
    ],
    declarations: [
        OutletHelpComponent
    ]
})
export class HelpModule {
}

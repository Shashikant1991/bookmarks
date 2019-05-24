import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OutletFeedbackComponent} from './outlet-feedback/outlet-feedback.component';
import {OutletHelpComponent} from './outlet-help/outlet-help.component';

const routes: Routes = [
    {
        path: '',
        component: OutletHelpComponent
    }, {
        path: 'feedback',
        component: OutletFeedbackComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HelpRoutingModule {
}

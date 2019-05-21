import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OutletHelpComponent} from './outlet-help/outlet-help.component';

const routes: Routes = [
    {
        path: '',
        component: OutletHelpComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HelpRoutingModule {
}

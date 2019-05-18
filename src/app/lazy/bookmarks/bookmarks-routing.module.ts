import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OutletEditorComponent} from './outlet-editor/outlet-editor.component';

const routes: Routes = [
    {
        path: ':documentId',
        component: OutletEditorComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookmarksRoutingModule {
}

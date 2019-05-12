import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OutletDocumentsComponent} from './outlet-documents/outlet-documents.component';
import {OutletEditorComponent} from './outlet-editor/outlet-editor.component';

const routes: Routes = [
    {
        path: '',
        component: OutletDocumentsComponent
    }, {
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

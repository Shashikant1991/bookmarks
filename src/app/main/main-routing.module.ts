import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserSessionGuard} from '../lazy/users/user-session.guard';
import {DocumentsResolver} from '../shared/resolvers/documents-resolver';
import {LabelsResolver} from '../shared/resolvers/labels-resolver';
import {OutletMainComponent} from './outlet-main/outlet-main.component';
import {RouteNotFoundComponent} from './route-not-found/route-not-found.component';

const routes: Routes = [
    {
        path: '',
        component: OutletMainComponent,
        canActivate: [UserSessionGuard],
        canActivateChild: [UserSessionGuard],
        resolve: {
            documents: DocumentsResolver,
            labels: LabelsResolver
        },
        children: [
            {
                path: 'bookmarks',
                loadChildren: '../lazy/bookmarks/bookmarks.module#BookmarksModule'
            }, {
                path: 'labels',
                loadChildren: '../lazy/labels/labels.module#LabelsModule'
            }, {
                path: 'templates',
                loadChildren: '../lazy/templates/templates.module#TemplatesModule'
            }
        ]
    }, {
        path: 'users',
        loadChildren: '../lazy/users/users.module#UsersModule'
    }, {
        path: '**',
        component: RouteNotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        paramsInheritanceStrategy: 'always'
    })],
    exports: [RouterModule]
})
export class MainRoutingModule {
}

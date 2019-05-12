import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EndSessionGuard} from './end-session.guard';
import {OutletActivateComponent} from './outlet-activate/outlet-activate.component';
import {OutletLogInComponent} from './outlet-log-in/outlet-log-in.component';
import {OutletLogOutComponent} from './outlet-log-out/outlet-log-out.component';
import {OutletRegisterComponent} from './outlet-register/outlet-register.component';
import {OutletResetComponent} from './outlet-reset/outlet-reset.component';
import {OutletUsersComponent} from './outlet-users/outlet-users.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/users/login'
    }, {
        path: '',
        component: OutletUsersComponent,
        canActivate: [
            EndSessionGuard
        ],
        canActivateChild: [
            EndSessionGuard
        ],
        children: [
            {
                path: 'login',
                component: OutletLogInComponent
            }, {
                path: 'logout',
                component: OutletLogOutComponent
            }, {
                path: 'reset',
                component: OutletResetComponent
            }, {
                path: 'register',
                component: OutletRegisterComponent
            }, {
                path: 'activate',
                component: OutletActivateComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {
}

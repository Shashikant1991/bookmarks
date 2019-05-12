import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SatPopoverModule} from '@ncstate/sat-popover';
import {FormUtilsModule} from '../../shared/form-utils/form-utils.module';
import {MaterialModule} from '../../shared/material/material.module';
import {PasswordsModule} from '../../shared/passwords/passwords.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {OutletActivateComponent} from './outlet-activate/outlet-activate.component';
import {OutletLogInComponent} from './outlet-log-in/outlet-log-in.component';
import {OutletLogOutComponent} from './outlet-log-out/outlet-log-out.component';
import {OutletRegisterComponent} from './outlet-register/outlet-register.component';
import {OutletResetComponent} from './outlet-reset/outlet-reset.component';
import {OutletUsersComponent} from './outlet-users/outlet-users.component';
import {UsersRoutingModule} from './users-routing.module';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule, // can be removed when all forms are reactive
        ReactiveFormsModule,
        MaterialModule,
        FontAwesomeModule,
        UsersRoutingModule,
        FormUtilsModule,
        SatPopoverModule,
        PipesModule,
        PasswordsModule
    ],
    declarations: [
        OutletUsersComponent,
        OutletLogInComponent,
        OutletLogOutComponent,
        OutletRegisterComponent,
        OutletResetComponent,
        OutletActivateComponent
    ]
})
export class UsersModule {
}

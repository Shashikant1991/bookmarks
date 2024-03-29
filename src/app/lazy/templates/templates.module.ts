import {CommonModule, TitleCasePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {LoadersModule} from '../../shared/loaders/loaders.module';
import {MaterialModule} from '../../shared/material/material.module';
import {OutletTemplatesComponent} from './outlet-templates/outlet-templates.component';
import {TemplatesRoutingModule} from './templates-routing.module';
import {TemplatesService} from './templates/templates.service';

@NgModule({
    imports: [
        CommonModule,
        TemplatesRoutingModule,
        LoadersModule,
        MaterialModule
    ],
    declarations: [
        OutletTemplatesComponent
    ],
    providers: [
        {provide: TitleCasePipe, useClass: TitleCasePipe},
        TemplatesService
    ]
})
export class TemplatesModule {
}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {PipesModule} from '../pipes/pipes.module';
import {PasswordHelpComponent} from './password-help/password-help.component';
import {PasswordHintComponent} from './password-hint/password-hint.component';
import {PasswordSuggestionsComponent} from './password-suggestions/password-suggestions.component';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        PipesModule
    ],
    declarations: [
        PasswordHelpComponent,
        PasswordHintComponent,
        PasswordSuggestionsComponent
    ],
    exports: [
        PasswordHelpComponent,
        PasswordHintComponent,
        PasswordSuggestionsComponent
    ]
})
export class PasswordsModule {
}

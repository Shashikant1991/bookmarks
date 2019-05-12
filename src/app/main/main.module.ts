import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {library} from '@fortawesome/fontawesome-svg-core';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsRouterPluginModule} from '@ngxs/router-plugin';
import {NgxsModule} from '@ngxs/store';
// required by Material Angular
import 'hammerjs';
import {environment} from '../../environments/environment';
import {ChangesService} from '../shared/api/changes/changes.service';
import {UsersService} from '../shared/api/users/users.service';
import {BreakpointsService} from '../shared/dev-tools/breakpoints/breakpoints.service';
import {DevToolsModule} from '../shared/dev-tools/dev-tools.module';
import {DialogsModule} from '../shared/dialogs/dialogs.module';
import {DragModule} from '../shared/drag/drag.module';
import {EditorModule} from '../shared/editor/editor.module';
import {SideBarsModule} from '../shared/side-bars/side-bars.module';
import {ArchivedModule} from '../side-bars/archived/archived.module';
import {DebugModule} from '../side-bars/debug/debug.module';
import {GeneralModule} from '../side-bars/general/general.module';
import {SelectionModule} from '../side-bars/selection/selection.module';
import {AppState} from '../states/app/app.state';
import {ChangesState} from '../states/changes/changes.state';
import {CardEditorState} from '../states/editor/card-editor/card-editor.state';
import {CardsState} from '../states/editor/cards/cards.state';
import {DocumentsState} from '../states/editor/documents/documents.state';
import {DragState} from '../states/editor/drag/drag.state';
import {EditorState} from '../states/editor/editor.state';
import {GroupsState} from '../states/editor/groups/groups.state';
import {ItemsState} from '../states/editor/items/items.state';
import {LabelsState} from '../states/editor/labels/labels.state';
import {SelectionsState} from '../states/editor/selections/selections.state';
import {LayoutState} from '../states/layout/layout.state';
import {SideBarsState} from '../states/side-bars/side-bars.state';
import {UsersState} from '../states/users/users.state';
import {BodyComponent} from './body/body.component';
import {FontAwesomeIcons} from './font-awesome-icons';
import {MainRoutingModule} from './main-routing.module';
import {NetworkInterceptorService} from './network-interceptor/network-interceptor.service';
import {OutletMainComponent} from './outlet-main/outlet-main.component';
import {RouteNotFoundComponent} from './route-not-found/route-not-found.component';

library.add(...FontAwesomeIcons);

const STATES = [
    AppState,
    CardsState,
    CardEditorState,
    ChangesState,
    DragState,
    DocumentsState,
    EditorState,
    GroupsState,
    ItemsState,
    LayoutState,
    SelectionsState,
    UsersState,
    LabelsState,
    SideBarsState
];

const SIDE_BAR_MODULES = [
    DebugModule,
    ArchivedModule,
    GeneralModule,
    // LabelsModule,
    SelectionModule
];

@NgModule({
    imports: [
        BrowserModule.withServerTransition({appId: 'tags'}),
        BrowserAnimationsModule,
        HttpClientModule,
        NgxsModule.forRoot(STATES, {developmentMode: !environment.production}),
        NgxsReduxDevtoolsPluginModule.forRoot({disabled: environment.production}),
        // NgxsLoggerPluginModule.forRoot({disabled: environment.production}),
        NgxsRouterPluginModule.forRoot(),
        MainRoutingModule,
        CommonModule,
        SideBarsModule,
        DevToolsModule,
        EditorModule,
        DragModule,
        DialogsModule,
        ...SIDE_BAR_MODULES
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: NetworkInterceptorService, multi: true},
        {provide: LOCALE_ID, useValue: 'en'}
    ],
    declarations: [
        BodyComponent,
        RouteNotFoundComponent,
        OutletMainComponent
    ],
    bootstrap: [
        BodyComponent
    ]
})
export class MainModule {
    public constructor(changes: ChangesService,
                       breakpoints: BreakpointsService,
                       users: UsersService) {
        changes.initialize();
        breakpoints.initialize();
        users.restore();
    }
}

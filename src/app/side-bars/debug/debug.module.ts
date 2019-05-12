import {CommonModule} from '@angular/common';
import {Inject, NgModule, Optional, SkipSelf} from '@angular/core';
import {HotKeysService} from '../../shared/hot-keys/hot-keys/hot-keys.service';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ReactiveTool} from '../../shared/reactive-tools/reactive-tool';
import {SideBarsModule} from '../../shared/side-bars/side-bars.module';
import {AssertLoadedOnce} from '../assert-loaded.once';
import {DEBUG_SIDE_BAR_TOKEN} from './debug-side-bar.token';
import {DebugSideBarComponent} from './debug-side-bar/debug-side-bar.component';
import {DEBUG_TOOLS, DEBUG_TOOLS_PROVIDERS} from './debug-tools/debug-providers';

@NgModule({
    imports: [
        CommonModule,
        PipesModule,
        SideBarsModule
    ],
    declarations: [
        DebugSideBarComponent
    ],
    providers: [
        {provide: DEBUG_SIDE_BAR_TOKEN, useValue: DebugSideBarComponent},
        ...DEBUG_TOOLS_PROVIDERS
    ],
    entryComponents: [
        DebugSideBarComponent
    ]
})
export class DebugModule {
    public constructor(@SkipSelf() @Optional() duplicate: DebugModule,
                       hotKeys: HotKeysService,
                       /* @Inject(DEBUG_TOOLS) tools: ReactiveTool[] */) {
        AssertLoadedOnce(duplicate);
        // hotKeys.registerMany(tools);
    }
}

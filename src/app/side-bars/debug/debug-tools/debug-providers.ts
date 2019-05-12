import {InjectionToken} from '@angular/core';
import {ReactiveTool} from '../../../shared/reactive-tools/reactive-tool';
import {GENERAL_SIDE_TOOLS} from '../../general/general-tools/general-providers';
import {DebugPanelService} from './debug-panel.service';

export const DEBUG_TOOLS: InjectionToken<ReactiveTool[]> = new InjectionToken<ReactiveTool[]>('DEBUG_TOOLS');

export const DEBUG_TOOLS_PROVIDERS = [
    {provide: GENERAL_SIDE_TOOLS, useClass: DebugPanelService, multi: true},
];

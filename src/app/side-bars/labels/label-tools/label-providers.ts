import {InjectionToken} from '@angular/core';
import {ReactiveTool} from '../../../shared/reactive-tools/reactive-tool';
import {GENERAL_SIDE_TOOLS} from '../../general/general-tools/general-providers';
import {LabelEditDeleteService} from './label-edit-delete.service';
import {LabelsManageService} from './labels-manage.service';

export const LABEL_TOOLS: InjectionToken<ReactiveTool[]> = new InjectionToken<ReactiveTool[]>('LABEL_TOOLS');

export const LABEL_EDIT_TOOLS: InjectionToken<ReactiveTool[]> = new InjectionToken<ReactiveTool[]>('LABEL_EDIT_TOOLS');

export const LABEL_PROVIDERS = [
    {provide: GENERAL_SIDE_TOOLS, useClass: LabelsManageService, multi: true},
];

export const LABEL_EDIT_PROVIDERS = [
    {provide: LABEL_EDIT_TOOLS, useClass: LabelEditDeleteService, multi: true}
];


import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ReactiveTool, ReactiveToolConfig} from '../../../shared/reactive-tools/reactive-tool';
import {ReactiveToolContext} from '../../../shared/reactive-tools/reactive-tool-context';
import {LabelEditContext} from './label-edit-context';

@Injectable()
export class LabelEditDeleteService implements ReactiveTool {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '9999:0300'
    };

    public constructor(private _context: LabelEditContext) {

    }

    public icon(): Observable<string> {
        return of('trash');
    }

    public title(): Observable<string> {
        return of('Delete');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger(context?: ReactiveToolContext) {
    }
}

import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ReactiveTool} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class GeneralHelpService implements ReactiveTool {
    public readonly order: string = '0300:0100';

    public icon(): Observable<string> {
        return of('question-circle');
    }

    public title(): Observable<string> {
        return of('Help');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }
}

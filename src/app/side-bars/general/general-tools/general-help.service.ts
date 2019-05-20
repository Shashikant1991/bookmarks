import {Injectable} from '@angular/core';
import {Navigate} from '@ngxs/router-plugin';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {ReactiveTool, ReactiveToolConfig} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class GeneralHelpService implements ReactiveTool {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0300:0100'
    };

    public constructor(private _store: Store) {

    }

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
        this._store.dispatch(new Navigate(['/']));
    }
}

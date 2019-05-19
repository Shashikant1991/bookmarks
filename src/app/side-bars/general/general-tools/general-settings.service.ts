import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolDisabled, ReactiveToolVisible} from '../../../shared/reactive-tools/reactive-tool';
import {SelectionsState} from '../../../states/editor/selections/selections.state';

@Injectable()
export class GeneralSettingsService implements ReactiveTool, ReactiveToolDisabled, ReactiveToolVisible {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0100:0500'
    };

    public constructor(private _store: Store) {

    }

    public disabled(): Observable<boolean> {
        return this._store.select(SelectionsState.someSelected);
    }

    public icon(): Observable<string> {
        return of('cog');
    }

    public title(): Observable<string> {
        return of('Settings');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }

    public visible(): Observable<boolean> {
        return of(false);
    }
}

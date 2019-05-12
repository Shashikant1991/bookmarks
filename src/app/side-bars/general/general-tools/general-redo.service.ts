import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolDisabled, ReactiveToolVisible} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class GeneralRedoService implements ReactiveTool, ReactiveToolDisabled, ReactiveToolVisible {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0100:0400'
    };

    public disabled(): Observable<boolean> {
        return of(true);
    }

    public icon(): Observable<string> {
        return of('redo');
    }

    public title(): Observable<string> {
        return of('Redo');
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

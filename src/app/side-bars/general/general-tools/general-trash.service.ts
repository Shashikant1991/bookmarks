import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ReactiveTool, ReactiveToolVisible} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class GeneralTrashService implements ReactiveTool, ReactiveToolVisible {
    public readonly order: string = '0100:0200';

    public icon(): Observable<string> {
        return of('trash');
    }

    public title(): Observable<string> {
        return of('Trash');
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

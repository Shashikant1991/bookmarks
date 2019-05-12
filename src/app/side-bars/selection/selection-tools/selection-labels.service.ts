import {ElementRef, Injectable, ViewContainerRef} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ReactiveTool} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class SelectionLabelsService implements ReactiveTool {
    public readonly order: string = '0300:0100';

    public icon(): Observable<string> {
        return of('tag');
    }

    public title(): Observable<string> {
        return of('Add label');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }
}

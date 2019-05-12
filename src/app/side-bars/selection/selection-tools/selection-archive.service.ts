import {ElementRef, Injectable, ViewContainerRef} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ReactiveTool} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class SelectionArchiveService implements ReactiveTool {
    public readonly order: string = '0999:0100';

    public icon(): Observable<string> {
        return of('archive');
    }

    public title(): Observable<string> {
        return of('Archive');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }
}

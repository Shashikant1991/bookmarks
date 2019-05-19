import {ElementRef, Injectable, ViewContainerRef} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ReactiveTool} from '../../../shared/reactive-tools/reactive-tool';

@Injectable()
export class GeneralSendFeedbackService implements ReactiveTool {
    public readonly order: string = '0300:0300';

    public icon(): Observable<string> {
        return of('envelope');
    }

    public title(): Observable<string> {
        return of('Send feedback');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }
}

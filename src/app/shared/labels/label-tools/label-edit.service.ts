import {ElementRef, Injectable, OnDestroy, ViewContainerRef} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {ReactiveTool, ReactiveToolDisabled} from '../../reactive-tools/reactive-tool';

@Injectable()
export class LabelEditService implements ReactiveTool, ReactiveToolDisabled, OnDestroy {
    public readonly order: string = '0100:0100';

    private readonly _destroyed$: Subject<void> = new Subject();

    private _isOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public constructor() {

    }

    public disabled(): Observable<boolean> {
        return this._isOpen$;
    }

    public icon(): Observable<string> {
        return this._isOpen$.pipe(map(value => value ? 'tag' : 'tag'));
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public title(): Observable<string> {
        return of('Labels');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger() {
    }
}

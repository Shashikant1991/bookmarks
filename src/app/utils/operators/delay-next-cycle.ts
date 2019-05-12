import {Observable, OperatorFunction} from 'rxjs';
import {takeUntil, takeWhile} from 'rxjs/operators';

export function delayNextCycle<T>(destroyed$: Observable<void>): OperatorFunction<T, T> {
    return function (source: Observable<T>): Observable<T> {
        return new Observable(subscriber => {
            source.pipe(
                takeUntil(destroyed$),
                takeWhile(() => !subscriber.closed)
            ).subscribe(
                value => window.setTimeout(() => subscriber.next(value)),
                error => window.setTimeout(() => subscriber.error(error)),
                () => window.setTimeout(() => subscriber.complete())
            );
        });
    };
}

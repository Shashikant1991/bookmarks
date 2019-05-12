import {animate, AnimationEvent, group, query, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {NavigationStart, Router, RouterOutlet} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {LayoutState} from '../../../states/layout/layout.state';

@Component({
    selector: 'tag-outlet-users',
    templateUrl: './outlet-users.component.html',
    styleUrls: ['./outlet-users.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('slide', [
            transition('placed => in', [
                group([
                    style({transform: 'translateX(-10rem)'}),
                    animate('250ms ease-in-out', style({transform: 'translateX(10rem)'})),
                    query(':enter', [
                        style({opacity: 0}),
                        animate('250ms ease-in-out', style({opacity: 1}))
                    ], {optional: true}),
                    query(':leave', [
                        style({opacity: 1}),
                        animate('250ms ease-in-out', style({opacity: 0}))
                    ], {optional: true}),
                ])
            ]),
            transition('placed => out', [
                group([
                    style({transform: 'translateX(10rem)'}),
                    animate('250ms ease-in-out', style({transform: 'translateX(-10rem)'})),
                    query(':enter', [
                        style({opacity: 0}),
                        animate('250ms ease-in-out', style({opacity: 1}))
                    ], {optional: true}),
                    query(':leave', [
                        style({opacity: 1}),
                        animate('250ms ease-in-out', style({opacity: 0}))
                    ], {optional: true}),
                ])
            ])
        ])
    ]
})
export class OutletUsersComponent implements OnDestroy {
    @ViewChild('content')
    public content: ElementRef<HTMLDivElement>;

    @Select(LayoutState.isHandset)
    public handset$: Observable<boolean>;

    @ViewChild('outlet')
    public outlet: RouterOutlet;

    public state: string = 'placed';

    @Select(LayoutState.isTablet)
    public tablet$: Observable<boolean>;

    @Select(LayoutState.isWeb)
    public web$: Observable<boolean>;

    private readonly _destroyed: Subject<void> = new Subject<void>();

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _router: Router,
                       private _change: ChangeDetectorRef,
                       log: LogService) {
        this._log = log.withPrefix(OutletUsersComponent.name);
        this._router.events
            .pipe(takeUntil(this._destroyed))
            .subscribe((event) => {
                if (event instanceof NavigationStart) {
                    if (event.url.startsWith('/users')) {
                        this.state = event.url === '/users/login' ? 'in' : 'out';
                        this._change.markForCheck();
                    }
                }
            });
    }

    public animationEvent(event: AnimationEvent) {
        if (event.phaseName === 'done' && (event.toState === 'out' || event.toState === 'in')) {
            this.state = 'placed';
            this._change.markForCheck();
        }
    }

    public ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }
}

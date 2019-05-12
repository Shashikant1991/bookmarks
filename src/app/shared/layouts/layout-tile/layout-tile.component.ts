import {ChangeDetectionStrategy, Component, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {LogService} from '../../dev-tools/log/log.service';
import {WINDOW} from '../../dev-tools/window-token';
import {EntityIdType} from '../../networks/networks.types';
import {LayoutPosition} from '../layout-algorithm/layout-position';
import {LayoutTilesComponent} from '../layout-tiles/layout-tiles.component';

@Component({
    selector: 'tag-layout-tile',
    templateUrl: './layout-tile.component.html',
    styleUrls: ['./layout-tile.component.scss'],
    // host: {
    //     '[@fadeInOut]': '"in"',
    //     '(@fadeInOut.start)': 'animationEvent($event)',
    //     '(@fadeInOut.done)': 'animationEvent($event)'
    // },
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'layoutTile',
    // animations: [
    //     trigger('fadeInOut', [
    //         state('in', style({opacity: 1})),
    //         transition(':enter', [
    //             style({opacity: 0}),
    //             animate('250ms ease-in', style({opacity: 1}))
    //         ]),
    //         transition(':leave', [
    //             animate('250ms ease-in', style({opacity: 0}))
    //         ])
    //     ])
    // ]
})
export class LayoutTileComponent implements OnDestroy, OnInit {
    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _entityId$: BehaviorSubject<EntityIdType> = new BehaviorSubject(0);

    private readonly _height$: BehaviorSubject<number> = new BehaviorSubject(0);

    private _layout: LayoutPosition;

    private readonly _log: LogService;

    private readonly _order$: BehaviorSubject<number> = new BehaviorSubject(0);

    public constructor(private _tiles: LayoutTilesComponent,
                       private _el: ElementRef<HTMLElement>,
                       private _zone: NgZone,
                       @Inject(WINDOW) private _wnd: Window,
                       log: LogService) {
        this._log = log.withPrefix(LayoutTileComponent.name);
    }

    @Input()
    public set entityId(id: EntityIdType) {
        this._entityId$.next(id);
    }

    @Input()
    public set order(order: number) {
        this._order$.next(order);
    }

    public checkHeight() {
        this._zone.onStable
            .pipe(first(), takeUntil(this._destroyed$))
            .subscribe(() => this._height$.next(this._el.nativeElement.getBoundingClientRect().height));
    }

    public ngOnDestroy(): void {
        this._tiles.detach(this._layout);

        this._destroyed$.next();

        this._order$.complete();
        this._height$.complete();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this.checkHeight();

        this._layout = new LayoutPosition(this._entityId$, this._order$, this._height$);
        this._tiles.attach(this._layout);

        const el = this._el.nativeElement;

        this._layout.width$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(width => el.style.width = `${width}px`);

        this._layout.position$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(position => {
                // http://javascript.info/coordinates
                el.style.top = `${position.y}px`;
                el.style.left = `${position.x}px`;
            });

        this._layout.position$.pipe(
            first(),
            takeUntil(this._destroyed$)
        ).subscribe(() => this._wnd.setTimeout(() => el.classList.add('tile-initialized')));
    }
}

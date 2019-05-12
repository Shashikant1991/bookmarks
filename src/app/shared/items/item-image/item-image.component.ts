import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {ReplaySubject, Subject} from 'rxjs';
import {distinctUntilChanged, map, switchMap, takeUntil} from 'rxjs/operators';
import {ItemsState} from '../../../states/editor/items/items.state';
import {ItemEntity} from '../../networks/entities/item.entity';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-item-image',
    templateUrl: './item-image.component.html',
    styleUrls: ['./item-image.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemImageComponent implements OnInit, OnDestroy {
    public url: string;

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _itemId$: ReplaySubject<EntityIdType> = new ReplaySubject(1);

    public constructor(private _store: Store,
                       private _change: ChangeDetectorRef) {
    }

    @Input()
    public set itemId(itemId: EntityIdType) {
        this._itemId$.next(itemId);
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    public ngOnInit(): void {
        this._itemId$.pipe(
            switchMap(itemId => this._store.select(ItemsState.byId).pipe(map(selector => selector(itemId)))),
            map((item: ItemEntity) => item && item.image),
            distinctUntilChanged(),
            takeUntil(this._destroyed$)
        ).subscribe(url => {
            this.url = url;
            this._change.markForCheck();
        });
    }
}

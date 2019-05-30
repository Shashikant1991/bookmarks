import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Store} from '@ngxs/store';
import {combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {CardEditorState} from '../../../states/editor/card-editor/card-editor.state';
import {DragState} from '../../../states/editor/drag/drag.state';
import {SelectionsState} from '../../../states/editor/selections/selections.state';
import {AniOpenCloseEnum} from '../../animations/animations.typets';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-card-outline',
    templateUrl: './card-outline.component.html',
    styleUrls: ['./card-outline.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardOutlineComponent {
    public hide$: Observable<boolean>;

    public isHovered$: Observable<boolean>;

    public isSelected$: Observable<boolean>;

    public constructor(private _store: Store) {
    }

    @Input()
    public set cardId(cardId: EntityIdType) {
        const cardEditorOpen$: Observable<boolean> = combineLatest([
            this._store.select(CardEditorState.cardId),
            this._store.select(CardEditorState.editorState)
        ]).pipe(map(([editorCardId, editorState]) => editorCardId === cardId ? editorState !== AniOpenCloseEnum.CLOSE : false));

        const cardDragging$: Observable<boolean> = this._store.select(DragState.isDraggingCardById)
            .pipe(map(selector => selector(cardId)));

        this.hide$ = combineLatest([cardEditorOpen$, cardDragging$])
            .pipe(
                map(([cardEditorOpen, cardDragging]) => cardEditorOpen || cardDragging),
                distinctUntilChanged()
            );

        this.isSelected$ = this._store.select(SelectionsState.isSelected).pipe(
            map(selector => selector(cardId)),
            distinctUntilChanged()
        );

        this.isHovered$ = this._store.select(DragState.hoverDragId).pipe(
            map(hoverCardId => hoverCardId === cardId),
            distinctUntilChanged()
        );
    }
}

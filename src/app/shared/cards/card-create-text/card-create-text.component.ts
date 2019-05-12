import {ChangeDetectionStrategy, Component} from '@angular/core';

/**
 * @deprecated This component doesn't really solve a problem.
 */
@Component({
    selector: 'tag-card-create-text',
    templateUrl: './card-create-text.component.html',
    styleUrls: ['./card-create-text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'createText'
})
export class CardCreateTextComponent {
    public readonly buttonIcon: string = 'edit';

    public readonly buttonText: string = 'Add Bookmarks';
}

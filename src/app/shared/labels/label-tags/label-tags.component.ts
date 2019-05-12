import {Attribute, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {EntityIdType} from '../../networks/networks.types';

@Component({
    selector: 'tag-label-tags',
    templateUrl: './label-tags.component.html',
    styleUrls: ['./label-tags.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelTagsComponent {
    @Input()
    public labelIds: EntityIdType[];

    public constructor(@Attribute('mode') public mode: 'card' | 'document') {
        this.mode = this.mode || 'card';
    }
}

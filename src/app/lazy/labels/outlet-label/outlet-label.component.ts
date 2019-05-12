import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'tag-outlet-label',
    templateUrl: './outlet-label.component.html',
    styleUrls: ['./outlet-label.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletLabelComponent {
}

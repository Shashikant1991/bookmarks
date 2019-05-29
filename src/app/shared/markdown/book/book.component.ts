import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'rg-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookComponent {
}

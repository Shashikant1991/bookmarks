import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'tag-dialog-header',
    templateUrl: './dialog-header.component.html',
    styleUrls: ['./dialog-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogHeaderComponent {
    @Input()
    public closable: boolean;

    @Output()
    public close: EventEmitter<void> = new EventEmitter();

    @Input()
    public icon: string;

    @Input()
    public title: string;
}

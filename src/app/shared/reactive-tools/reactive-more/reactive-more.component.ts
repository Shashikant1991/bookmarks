import {ChangeDetectionStrategy, Component, Input, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {ReactiveTool} from '../reactive-tool';

@Component({
    selector: 'tag-reactive-more',
    templateUrl: './reactive-more.component.html',
    styleUrls: ['./reactive-more.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveMoreComponent {
    @Output()
    public closed: Subject<void> = new Subject();

    @Input()
    public muted: boolean;

    @Output()
    public opened: Subject<void> = new Subject();

    @Input()
    public tools: ReactiveTool[];
}

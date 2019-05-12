import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
    selector: 'tag-route-not-found',
    templateUrl: './route-not-found.component.html',
    styleUrls: ['./route-not-found.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteNotFoundComponent {
}

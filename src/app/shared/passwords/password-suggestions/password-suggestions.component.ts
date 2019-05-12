import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
    selector: 'tag-password-suggestions',
    templateUrl: './password-suggestions.component.html',
    styleUrls: ['./password-suggestions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordSuggestionsComponent implements OnChanges {
    public suggestions: string[];

    @Input()
    public values: string[];

    public ngOnChanges(changes: SimpleChanges): void {
        this.suggestions = this.values.slice();
        this.suggestions.unshift('Make it at 8 characters or more.');
        this.suggestions.unshift('Don\'t use your email address.');
    }
}

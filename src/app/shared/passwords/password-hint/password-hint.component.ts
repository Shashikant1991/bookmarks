import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'tag-password-hint',
    templateUrl: './password-hint.component.html',
    styleUrls: ['./password-hint.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.strength-weak]': 'score < 2',
        '[class.strength-fair]': 'score === 2',
        '[class.strength-good]': 'score === 3',
        '[class.strength-strong]': 'score === 4',
    }
})
export class PasswordHintComponent {
    @Input()
    public score: number;

    public getVerb(): string {
        if (!this.score || this.score < 2) {
            return 'weak';
        } else if (this.score < 3) {
            return 'fair';
        } else if (this.score < 4) {
            return 'good';
        }
        return 'strong';
    }
}

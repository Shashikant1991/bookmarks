import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PipesModule} from '../../pipes/pipes.module';
import {PasswordSuggestionsComponent} from './password-suggestions.component';

describe(PasswordSuggestionsComponent.name, () => {
    let component: PasswordSuggestionsComponent;
    let fixture: ComponentFixture<PasswordSuggestionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PasswordSuggestionsComponent],
            imports: [PipesModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PasswordSuggestionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

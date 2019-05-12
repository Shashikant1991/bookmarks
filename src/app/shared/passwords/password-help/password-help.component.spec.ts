import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PasswordHelpComponent} from './password-help.component';

describe(PasswordHelpComponent.name, () => {
    let component: PasswordHelpComponent;
    let fixture: ComponentFixture<PasswordHelpComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PasswordHelpComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PasswordHelpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

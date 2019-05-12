import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {OutletLogInComponent} from './outlet-log-in.component';

describe(OutletLogInComponent.name, () => {
    let component: OutletLogInComponent;
    let fixture: ComponentFixture<OutletLogInComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OutletLogInComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OutletLogInComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {OutletResetComponent} from './outlet-reset.component';

describe(OutletResetComponent.name, () => {
    let component: OutletResetComponent;
    let fixture: ComponentFixture<OutletResetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OutletResetComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OutletResetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

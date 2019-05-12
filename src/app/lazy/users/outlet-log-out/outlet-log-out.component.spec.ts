import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {OutletLogOutComponent} from './outlet-log-out.component';

describe(OutletLogOutComponent.name, () => {
    let component: OutletLogOutComponent;
    let fixture: ComponentFixture<OutletLogOutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OutletLogOutComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OutletLogOutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

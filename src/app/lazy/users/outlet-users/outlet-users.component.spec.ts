import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {OutletUsersComponent} from './outlet-users.component';

describe(OutletUsersComponent.name, () => {
    let component: OutletUsersComponent;
    let fixture: ComponentFixture<OutletUsersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OutletUsersComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OutletUsersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

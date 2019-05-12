import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {OutletActivateComponent} from './outlet-activate.component';

describe(OutletActivateComponent.name, () => {
    let component: OutletActivateComponent;
    let fixture: ComponentFixture<OutletActivateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OutletActivateComponent],
            imports: []
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OutletActivateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

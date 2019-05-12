import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SatPopoverModule} from '@ncstate/sat-popover';
import {FormUtilsModule} from '../../../shared/form-utils/form-utils.module';
import {PasswordsModule} from '../../../shared/passwords/passwords.module';
import {OutletRegisterComponent} from './outlet-register.component';

describe(OutletRegisterComponent.name, () => {
    let component: OutletRegisterComponent;
    let fixture: ComponentFixture<OutletRegisterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OutletRegisterComponent],
            imports: [
                SatPopoverModule,
                PasswordsModule,
                FormUtilsModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OutletRegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

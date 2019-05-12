import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeatureLoaderComponent} from './feature-loader.component';

describe(FeatureLoaderComponent.name, () => {
    let component: FeatureLoaderComponent;
    let fixture: ComponentFixture<FeatureLoaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FeatureLoaderComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeatureLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

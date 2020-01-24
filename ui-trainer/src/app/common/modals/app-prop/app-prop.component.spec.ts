import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPropComponent } from './app-prop.component';

describe('AppPropComponent', () => {
  let component: AppPropComponent;
  let fixture: ComponentFixture<AppPropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

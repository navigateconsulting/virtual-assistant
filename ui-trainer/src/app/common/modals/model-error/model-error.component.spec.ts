import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelErrorComponent } from './model-error.component';

describe('ModelErrorComponent', () => {
  let component: ModelErrorComponent;
  let fixture: ComponentFixture<ModelErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

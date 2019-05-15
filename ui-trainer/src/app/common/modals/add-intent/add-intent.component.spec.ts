import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIntentComponent } from './add-intent.component';

describe('AddIntentComponent', () => {
  let component: AddIntentComponent;
  let fixture: ComponentFixture<AddIntentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIntentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIntentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResponseComponent } from './add-response.component';

describe('AddResponseComponent', () => {
  let component: AddResponseComponent;
  let fixture: ComponentFixture<AddResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

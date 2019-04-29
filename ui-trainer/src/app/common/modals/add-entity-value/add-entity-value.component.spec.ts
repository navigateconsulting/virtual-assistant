import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntityValueComponent } from './add-entity-value.component';

describe('AddEntityValueComponent', () => {
  let component: AddEntityValueComponent;
  let fixture: ComponentFixture<AddEntityValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEntityValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntityValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIrsComponent } from './manage-irs.component';

describe('ManageIrsComponent', () => {
  let component: ManageIrsComponent;
  let fixture: ComponentFixture<ManageIrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageIrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

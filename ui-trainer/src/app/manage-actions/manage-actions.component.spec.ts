import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageActionsComponent } from './manage-actions.component';

describe('ManageActionsComponent', () => {
  let component: ManageActionsComponent;
  let fixture: ComponentFixture<ManageActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

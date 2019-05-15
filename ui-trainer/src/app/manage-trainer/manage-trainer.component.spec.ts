import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTrainerComponent } from './manage-trainer.component';

describe('ManageTrainerComponent', () => {
  let component: ManageTrainerComponent;
  let fixture: ComponentFixture<ManageTrainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTrainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIntentsComponent } from './manage-intents.component';

describe('ManageIntentsComponent', () => {
  let component: ManageIntentsComponent;
  let fixture: ComponentFixture<ManageIntentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageIntentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIntentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

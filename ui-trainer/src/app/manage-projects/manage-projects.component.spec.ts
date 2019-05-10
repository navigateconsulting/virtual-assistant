import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProjectsComponent } from './manage-projects.component';

describe('ManageProjectsComponent', () => {
  let component: ManageProjectsComponent;
  let fixture: ComponentFixture<ManageProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

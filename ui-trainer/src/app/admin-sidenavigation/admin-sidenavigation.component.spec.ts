import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSidenavigationComponent } from './admin-sidenavigation.component';

describe('AdminSidenavigationComponent', () => {
  let component: AdminSidenavigationComponent;
  let fixture: ComponentFixture<AdminSidenavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSidenavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSidenavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDomainsComponent } from './manage-domains.component';

describe('ManageDomainsComponent', () => {
  let component: ManageDomainsComponent;
  let fixture: ComponentFixture<ManageDomainsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDomainsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

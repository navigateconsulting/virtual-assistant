import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDomainComponent } from './edit-domain.component';

describe('EditDomainComponent', () => {
  let component: EditDomainComponent;
  let fixture: ComponentFixture<EditDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

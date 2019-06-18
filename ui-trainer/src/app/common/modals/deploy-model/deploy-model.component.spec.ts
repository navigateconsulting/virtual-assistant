import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployModelComponent } from './deploy-model.component';

describe('DeployModelComponent', () => {
  let component: DeployModelComponent;
  let fixture: ComponentFixture<DeployModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeployModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

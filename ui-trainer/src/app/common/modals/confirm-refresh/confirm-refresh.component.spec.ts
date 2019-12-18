import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRefreshComponent } from './confirm-refresh.component';

describe('ConfirmRefreshComponent', () => {
  let component: ConfirmRefreshComponent;
  let fixture: ComponentFixture<ConfirmRefreshComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmRefreshComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

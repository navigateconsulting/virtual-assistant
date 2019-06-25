import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TryNowLoadComponent } from './try-now-load.component';

describe('TryNowLoadComponent', () => {
  let component: TryNowLoadComponent;
  let fixture: ComponentFixture<TryNowLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TryNowLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TryNowLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

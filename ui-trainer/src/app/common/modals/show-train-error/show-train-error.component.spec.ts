import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTrainErrorComponent } from './show-train-error.component';

describe('ShowTrainErrorComponent', () => {
  let component: ShowTrainErrorComponent;
  let fixture: ComponentFixture<ShowTrainErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowTrainErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTrainErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIntentComponent } from './delete-intent.component';

describe('DeleteIntentComponent', () => {
  let component: DeleteIntentComponent;
  let fixture: ComponentFixture<DeleteIntentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteIntentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteIntentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteResponseComponent } from './delete-response.component';

describe('DeleteResponseComponent', () => {
  let component: DeleteResponseComponent;
  let fixture: ComponentFixture<DeleteResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

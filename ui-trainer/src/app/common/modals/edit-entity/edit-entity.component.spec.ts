import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEntityComponent } from './edit-entity.component';

describe('EditEntityComponent', () => {
  let component: EditEntityComponent;
  let fixture: ComponentFixture<EditEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

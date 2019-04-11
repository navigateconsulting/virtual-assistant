import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntityComponent } from './add-entity.component';

describe('AddEntityComponent', () => {
  let component: AddEntityComponent;
  let fixture: ComponentFixture<AddEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

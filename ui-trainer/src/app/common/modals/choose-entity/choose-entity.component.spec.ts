import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseEntityComponent } from './choose-entity.component';

describe('ChooseEntityComponent', () => {
  let component: ChooseEntityComponent;
  let fixture: ComponentFixture<ChooseEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

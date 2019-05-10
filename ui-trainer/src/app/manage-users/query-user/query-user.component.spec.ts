import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryUserComponent } from './query-user.component';

describe('QueryUserComponent', () => {
  let component: QueryUserComponent;
  let fixture: ComponentFixture<QueryUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

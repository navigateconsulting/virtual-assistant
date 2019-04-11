import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStoriesComponent } from './manage-stories.component';

describe('ManageStoriesComponent', () => {
  let component: ManageStoriesComponent;
  let fixture: ComponentFixture<ManageStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

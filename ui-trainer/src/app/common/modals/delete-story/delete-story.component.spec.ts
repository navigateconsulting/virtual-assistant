import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteStoryComponent } from './delete-story.component';

describe('DeleteStoryComponent', () => {
  let component: DeleteStoryComponent;
  let fixture: ComponentFixture<DeleteStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

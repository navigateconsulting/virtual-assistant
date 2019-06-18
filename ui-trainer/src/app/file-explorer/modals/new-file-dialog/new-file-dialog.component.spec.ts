import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFileDialogComponent } from './new-file-dialog.component';

describe('NewFileDialogComponent', () => {
  let component: NewFileDialogComponent;
  let fixture: ComponentFixture<NewFileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameFileDialogComponent } from './rename-file-dialog.component';

describe('RenameFileDialogComponent', () => {
  let component: RenameFileDialogComponent;
  let fixture: ComponentFixture<RenameFileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameFileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

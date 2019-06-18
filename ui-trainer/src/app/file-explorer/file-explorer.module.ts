import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RenameDialogComponent } from './modals/rename-dialog/rename-dialog.component';
import { FileExplorerComponent } from './file-explorer.component';
import { NewFileDialogComponent } from './modals/new-file-dialog/new-file-dialog.component';
import { RenameFileDialogComponent } from './modals/rename-file-dialog/rename-file-dialog.component';
import { DeleteDialogComponent } from './modals/delete-dialog/delete-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    HttpClientModule
  ],
  // tslint:disable-next-line:max-line-length
  declarations: [FileExplorerComponent, NewFolderDialogComponent, RenameDialogComponent, NewFileDialogComponent, RenameFileDialogComponent, DeleteDialogComponent],
  exports: [FileExplorerComponent],
  // tslint:disable-next-line:max-line-length
  entryComponents: [NewFolderDialogComponent, RenameDialogComponent, NewFileDialogComponent, RenameFileDialogComponent, DeleteDialogComponent]
})
export class FileExplorerModule {}

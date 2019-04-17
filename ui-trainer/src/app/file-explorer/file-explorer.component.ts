import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileElement } from './model/element';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './modals/rename-dialog/rename-dialog.component';
import { NewFileDialogComponent } from './modals/new-file-dialog/new-file-dialog.component';
import { RenameFileDialogComponent } from './modals/rename-file-dialog/rename-file-dialog.component';
import { DeleteDialogComponent } from './modals/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent {

  constructor(public dialog: MatDialog) {}

  @Input() fileElements: FileElement[];
  @Input() canNavigateUp: string;
  @Input() path: string;
  @Input() showAddFolderFile: boolean;
  @Input() allJsonData: any;

  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() fileAdded = new EventEmitter<{ name: string, description: string }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{ element: FileElement; moveTo: FileElement }>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() navigatedUp = new EventEmitter<string>();

  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  navigate(element: FileElement) {
    // if (element.isFolder) {
    //   this.navigatedDown.emit(element);
    // }
    this.navigatedDown.emit(element);
  }

  navigateUp(path_class: string) {
    this.navigatedUp.emit(path_class);
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({ element: element, moveTo: moveTo });
  }

  openNewFolderDialog() {
    if (this.fileElements === null) {
      const dialogRef = this.dialog.open(NewFolderDialogComponent);
        dialogRef.afterClosed().subscribe(res => {
          if (res) {
            this.folderAdded.emit({ name: res });
          }
      });
    } else {
      if (this.fileElements.length !== 0) {
        if (this.fileElements[0].parent === 'root') {
          const dialogRef = this.dialog.open(NewFolderDialogComponent);
          dialogRef.afterClosed().subscribe(res => {
            if (res) {
              this.folderAdded.emit({ name: res });
            }
          });
        } else {
          const dialogRef = this.dialog.open(NewFileDialogComponent, {
            width: '400px',
          });
          dialogRef.afterClosed().subscribe(res => {
            if (res) {
              this.fileAdded.emit({ name: res.fileName, description: res.fileDescription });
            }
          });
        }
      } else {
        const dialogRef = this.dialog.open(NewFileDialogComponent, {
          width: '400px',
        });
        dialogRef.afterClosed().subscribe(res => {
          if (res) {
            this.fileAdded.emit({ name: res.fileName, description: res.fileDescription });
          }
        });
      }
    }
  }

  openRenameDialog(element: FileElement) {
    if (this.fileElements[0].parent === 'root') {
      const dialogRef = this.dialog.open(RenameDialogComponent, {
        data: { folderName: element.name }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          element.name = res;
          this.elementRenamed.emit(element);
        }
      });
    } else {
      const dialogRef = this.dialog.open(RenameFileDialogComponent, {
        width: '400px',
        data: { fileName: element.name, fileDescription: element.description }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          console.log(res);
          element.name = res.fileName;
          element.description = res.fileDescription;
          this.elementRenamed.emit(element);
        }
      });
    }
  }

  openDeleteDialog(element: FileElement) {
    if (this.fileElements[0].parent === 'root') {
      const dialogRef = this.dialog.open(DeleteDialogComponent);
      dialogRef.afterClosed().subscribe(res => {
        if (res === true) {
          this.deleteElement(element);
        }
      });
    } else {
      const dialogRef = this.dialog.open(DeleteDialogComponent);
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.deleteElement(element);
        }
      });
    }
  }

  openMenu(event: MouseEvent, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }

  changePath(event: any) {
    // console.log(event);
    // if (event.target.innerText === 'NLU' || event.target.innerText === 'Stories' || event.target.innerText === 'Utterances') {
    //   this.showAddFolderFile = true;
    //   const split = this.path.split(' / ');
    //   split.pop();
    //   this.path = split.join(' / ') + ' / ';
    // }
    this.navigateUp(event.target.className);
  }
}

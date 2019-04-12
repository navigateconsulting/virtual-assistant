import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-folder-dialog',
  templateUrl: './new-folder-dialog.component.html',
  styleUrls: ['./new-folder-dialog.component.scss']
})
export class NewFolderDialogComponent implements OnInit {

  folderName: string;

  constructor(public dialogRef: MatDialogRef<NewFolderDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close(this.folderName);
  }

}

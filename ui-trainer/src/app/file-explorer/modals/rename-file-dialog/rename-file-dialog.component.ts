import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rename-file-dialog',
  templateUrl: './rename-file-dialog.component.html',
  styleUrls: ['./rename-file-dialog.component.scss']
})
export class RenameFileDialogComponent implements OnInit {

  fileName: string;

  constructor(public dialogRef: MatDialogRef<RenameFileDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close(this.fileName);
  }

}

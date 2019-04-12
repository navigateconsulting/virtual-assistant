import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-file-dialog',
  templateUrl: './new-file-dialog.component.html',
  styleUrls: ['./new-file-dialog.component.scss']
})
export class NewFileDialogComponent implements OnInit {

  fileName: string;

  constructor(public dialogRef: MatDialogRef<NewFileDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close(this.fileName);
  }

}

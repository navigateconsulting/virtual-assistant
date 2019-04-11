import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rename-dialog',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.scss']
})
export class RenameDialogComponent implements OnInit {

  folderName: string;

  constructor(public dialogRef: MatDialogRef<RenameDialogComponent>) { }

  ngOnInit() {
  }

}

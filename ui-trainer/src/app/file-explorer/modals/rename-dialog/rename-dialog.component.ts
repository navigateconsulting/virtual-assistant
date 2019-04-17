import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rename-dialog',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.scss']
})
export class RenameDialogComponent implements OnInit {

  folderName: string;

  constructor(public dialogRef: MatDialogRef<RenameDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.folderName = this.data.folderName;
  }

  closeDialog() {
    if (this.folderName.trim() !== '') {
      this.dialogRef.close(this.folderName.trim());
    }
  }

}

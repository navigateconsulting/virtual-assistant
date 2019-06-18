import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-rename-file-dialog',
  templateUrl: './rename-file-dialog.component.html',
  styleUrls: ['./rename-file-dialog.component.scss']
})
export class RenameFileDialogComponent implements OnInit {

  renameFileForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<RenameFileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.renameFileForm = new FormGroup({
      fileName: new FormControl(this.data.fileName, Validators.required),
      fileDescription: new FormControl(this.data.fileDescription, Validators.required)
    });
  }

  closeDialog() {
    if (this.renameFileForm.valid) {
      this.dialogRef.close({fileName: this.renameFileForm.value.fileName, fileDescription: this.renameFileForm.value.fileDescription});
    }
  }
}

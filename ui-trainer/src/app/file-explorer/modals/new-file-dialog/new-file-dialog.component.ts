import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-file-dialog',
  templateUrl: './new-file-dialog.component.html',
  styleUrls: ['./new-file-dialog.component.scss']
})
export class NewFileDialogComponent implements OnInit {

  newFileForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<NewFileDialogComponent>) { }

  ngOnInit() {
    this.newFileForm = new FormGroup({
      fileName: new FormControl('', Validators.required),
      fileDescription: new FormControl('', Validators.required)
    });
  }

  closeDialog() {
    if (this.newFileForm.valid) {
      this.dialogRef.close({fileName: this.newFileForm.value.fileName, fileDescription: this.newFileForm.value.fileDescription});
    }
  }
}

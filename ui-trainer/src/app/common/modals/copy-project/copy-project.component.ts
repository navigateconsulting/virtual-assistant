import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-copy-project',
  templateUrl: './copy-project.component.html',
  styleUrls: ['./copy-project.component.scss']
})
export class CopyProjectComponent implements OnInit {

  copyProjectForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<CopyProjectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.copyProjectForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      projectDescription: new FormControl('', Validators.required)
    });
  }

  closeDialog() {
    if (this.copyProjectForm.valid) {
      this.dialogRef.close({
        object_id: this.data.projectObjectId,
        project_name: this.copyProjectForm.value.projectName,
        project_description: this.copyProjectForm.value.projectDescription,
        status: 0,
        created_by: 'trainer',
        source: this.data.projectName
      });
    }
  }
}

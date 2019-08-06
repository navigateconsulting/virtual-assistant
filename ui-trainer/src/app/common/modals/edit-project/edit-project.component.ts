import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  editProjectForm: FormGroup;
  @ViewChild('projectName') projectNameInput: MatInput;
  appSource: string;

  constructor(public dialogRef: MatDialogRef<EditProjectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.editProjectForm = new FormGroup({
      projectName: new FormControl({value: this.data.projectName, disabled: true}, Validators.required),
      projectDescription: new FormControl(this.data.projectDescription, Validators.required)
    });
    this.projectNameInput.focus();
  }

  closeDialog() {
    if (this.editProjectForm.valid) {
      this.dialogRef.close({
        object_id: this.data.projectObjectId,
        project_name: this.editProjectForm.value.projectName,
        project_description: this.editProjectForm.value.projectDescription
      });
    }
  }

}

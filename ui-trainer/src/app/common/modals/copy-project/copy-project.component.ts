import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-copy-project',
  templateUrl: './copy-project.component.html',
  styleUrls: ['./copy-project.component.scss']
})
export class CopyProjectComponent implements OnInit {

  copyProjectForm: FormGroup;
  @ViewChild('projectName') projectNameInput: MatInput;
  appSource: string;

  constructor(public dialogRef: MatDialogRef<CopyProjectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.copyProjectForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      projectDescription: new FormControl('', Validators.required)
    });
    this.projectNameInput.focus();
  }

  closeDialog() {
    if (this.copyProjectForm.valid) {
      this.dialogRef.close({
        object_id: this.data.projectObjectId,
        project_name: this.copyProjectForm.value.projectName,
        project_description: this.copyProjectForm.value.projectDescription,
        state: '',
        model_name: '',
        created_by: 'trainer',
        source: this.data.projectName
      });
    }
  }
}

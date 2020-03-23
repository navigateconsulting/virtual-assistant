import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

  newProjectForm: FormGroup;
  @ViewChild('projectName') projectNameInput: MatInput;

  constructor(public dialogRef: MatDialogRef<AddProjectComponent>) { }

  ngOnInit() {
    this.newProjectForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      projectDescription: new FormControl('', Validators.required)
    });
    this.projectNameInput.focus();
  }

  closeDialog() {
    if (this.newProjectForm.valid) {
      this.dialogRef.close({
        project_name: this.newProjectForm.value.projectName,
        project_description: this.newProjectForm.value.projectDescription,
        model_name: '',
        state: '',
        created_by: 'trainer',
        source: '-'
      });
    }
  }
}

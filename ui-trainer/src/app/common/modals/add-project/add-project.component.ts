import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

  newProjectForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddProjectComponent>) { }

  ngOnInit() {
    this.newProjectForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      projectDescription: new FormControl('', Validators.required)
    });
  }

  closeDialog() {
    if (this.newProjectForm.valid) {
      this.dialogRef.close({
        project_name: this.newProjectForm.value.projectName,
        project_description: this.newProjectForm.value.projectDescription,
        status: 0,
        created_by: 'trainer',
        source: '-'
      });
    }
  }
}

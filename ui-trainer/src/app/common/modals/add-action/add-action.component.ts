import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-action',
  templateUrl: './add-action.component.html',
  styleUrls: ['./add-action.component.scss']
})
export class AddActionComponent implements OnInit {

  newActionForm: FormGroup;
  @ViewChild('actionName') actionNameInput: MatInput;

  constructor(public dialogRef: MatDialogRef<AddActionComponent>) { }

  ngOnInit() {
    this.newActionForm = new FormGroup({
      actionName: new FormControl('', Validators.required),
      actionDescription: new FormControl('', Validators.required)
    });
    this.actionNameInput.focus();
  }

  closeDialog() {
    if (this.newActionForm.valid) {
      this.dialogRef.close({
        action_name: 'action_' + this.newActionForm.value.actionName,
        action_description: this.newActionForm.value.actionDescription
      });
    }
  }
}

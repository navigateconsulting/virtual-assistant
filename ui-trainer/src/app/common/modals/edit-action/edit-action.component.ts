import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-edit-action',
  templateUrl: './edit-action.component.html',
  styleUrls: ['./edit-action.component.scss']
})
export class EditActionComponent implements OnInit {

  editActionForm: FormGroup;
  @ViewChild('actionName') actionNameInput: MatInput;

  constructor(public dialogRef: MatDialogRef<EditActionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.editActionForm = new FormGroup({
      actionName: new FormControl({value: this.data.actionName, disabled: true}, Validators.required),
      actionDescription: new FormControl(this.data.actionDescription, Validators.required)
    });
    this.actionNameInput.focus();
  }

  closeDialog() {
    if (this.editActionForm.valid) {
      this.dialogRef.close({
        object_id: this.data.actionObjectId,
        action_name: this.editActionForm.value.actionName,
        action_description: this.editActionForm.value.actionDescription
      });
    }
  }

}

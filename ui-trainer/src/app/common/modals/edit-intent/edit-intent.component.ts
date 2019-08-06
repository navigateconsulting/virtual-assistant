import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-intent',
  templateUrl: './edit-intent.component.html',
  styleUrls: ['./edit-intent.component.scss']
})
export class EditIntentComponent implements OnInit {

  editIntentForm: FormGroup;
  appSource: string;

  constructor(public dialogRef: MatDialogRef<EditIntentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.editIntentForm = new FormGroup({
      intentName: new FormControl({value: this.data.intentName, disabled: true}, Validators.required),
      intentDescription: new FormControl(this.data.intentDescription, Validators.required)
    });
  }

  closeDialog() {
    if (this.editIntentForm.valid) {
      this.dialogRef.close({
        project_id: this.data.projectObjectId,
        domain_id: this.data.domainObjectId,
        object_id: this.data.intentObjectId,
        intent_name: this.data.intentName,
        intent_description: this.editIntentForm.value.intentDescription
      });
    }
  }
}

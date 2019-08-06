import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-intent',
  templateUrl: './add-intent.component.html',
  styleUrls: ['./add-intent.component.scss']
})
export class AddIntentComponent implements OnInit {

  newIntentForm: FormGroup;
  @ViewChild('intentName') intentNameInput: MatInput;
  appSource: string;

  constructor(public dialogRef: MatDialogRef<AddIntentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.newIntentForm = new FormGroup({
      intentName: new FormControl('', Validators.required),
      intentDescription: new FormControl('', Validators.required)
    });
    this.intentNameInput.focus();
  }

  closeDialog() {
    if (this.newIntentForm.valid) {
      this.dialogRef.close({
        project_id: this.data.projectObjectId,
        domain_id: this.data.domainObjectId,
        intent_name: this.newIntentForm.value.intentName,
        intent_description: this.newIntentForm.value.intentDescription
      });
    }
  }
}

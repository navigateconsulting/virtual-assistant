import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-response',
  templateUrl: './add-response.component.html',
  styleUrls: ['./add-response.component.scss']
})
export class AddResponseComponent implements OnInit {

  newResponseForm: FormGroup;
  @ViewChild('responseName') responseNameInput: MatInput;
  appSource: string;

  constructor(public dialogRef: MatDialogRef<AddResponseComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.newResponseForm = new FormGroup({
      responseName: new FormControl('', Validators.required),
      responseDescription: new FormControl('', Validators.required)
    });
    this.responseNameInput.focus();
  }

  closeDialog() {
    if (this.newResponseForm.valid) {
      this.dialogRef.close({
        project_id: this.data.projectObjectId,
        domain_id: this.data.domainObjectId,
        response_name: 'utter_' + this.newResponseForm.value.responseName,
        response_description: this.newResponseForm.value.responseDescription
      });
    }
  }

}

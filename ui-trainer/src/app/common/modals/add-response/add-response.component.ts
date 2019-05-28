import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-response',
  templateUrl: './add-response.component.html',
  styleUrls: ['./add-response.component.scss']
})
export class AddResponseComponent implements OnInit {

  newResponseForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddResponseComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.newResponseForm = new FormGroup({
      responseName: new FormControl('', Validators.required),
      responseDescription: new FormControl('', Validators.required)
    });
  }

  closeDialog() {
    if (this.newResponseForm.valid) {
      this.dialogRef.close({
        project_id: this.data.projectObjectId,
        domain_id: this.data.domainObjectId,
        response_name: this.newResponseForm.value.responseName,
        response_description: this.newResponseForm.value.responseDescription
      });
    }
  }

}

import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-domain',
  templateUrl: './edit-domain.component.html',
  styleUrls: ['./edit-domain.component.scss']
})
export class EditDomainComponent implements OnInit {

  editDomainForm: FormGroup;
  @ViewChild('domainName') domainNameInput: MatInput;
  appSource: string;

  constructor(public dialogRef: MatDialogRef<EditDomainComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.editDomainForm = new FormGroup({
      domainName: new FormControl({value: this.data.domainName, disabled: true}, Validators.required),
      domainDescription: new FormControl(this.data.domainDescription, Validators.required)
    });
    this.domainNameInput.focus();
  }

  closeDialog() {
    if (this.editDomainForm.valid) {
      this.dialogRef.close({
        project_id: this.data.projectObjectId,
        object_id: this.data.domainObjectId,
        domain_name: this.data.domainName,
        domain_description: this.editDomainForm.value.domainDescription
      });
    }
  }
}

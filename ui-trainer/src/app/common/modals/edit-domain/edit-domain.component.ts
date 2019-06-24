import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-edit-domain',
  templateUrl: './edit-domain.component.html',
  styleUrls: ['./edit-domain.component.scss']
})
export class EditDomainComponent implements OnInit {

  editDomainForm: FormGroup;
  @ViewChild('domainName') domainNameInput: MatInput;

  constructor(public dialogRef: MatDialogRef<EditDomainComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.editDomainForm = new FormGroup({
      domainName: new FormControl(this.data.domainName, Validators.required),
      domainDescription: new FormControl(this.data.domainDescription, Validators.required)
    });
    this.domainNameInput.focus();
  }

  closeDialog() {
    if (this.editDomainForm.valid) {
      this.dialogRef.close({
        project_id: this.data.projectObjectId,
        object_id: this.data.domainObjectId,
        domain_name: this.editDomainForm.value.domainName,
        domain_description: this.editDomainForm.value.domainDescription
      });
    }
  }
}

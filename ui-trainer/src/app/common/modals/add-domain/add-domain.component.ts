import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-domain',
  templateUrl: './add-domain.component.html',
  styleUrls: ['./add-domain.component.scss']
})
export class AddDomainComponent implements OnInit {

  newDomainForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddDomainComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.newDomainForm = new FormGroup({
      domainName: new FormControl('', Validators.required),
      domainDescription: new FormControl('', Validators.required)
    });
  }

  closeDialog() {
    if (this.newDomainForm.valid) {
      this.dialogRef.close({
        project_id: this.data.projectObjectId,
        domain_name: this.newDomainForm.value.domainName,
        domain_description: this.newDomainForm.value.domainDescription
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-delete-domain',
  templateUrl: './delete-domain.component.html',
  styleUrls: ['./delete-domain.component.scss']
})
export class DeleteDomainComponent implements OnInit {

  appSource: string;

  constructor(public dialogRef: MatDialogRef<DeleteDomainComponent>) { }

  ngOnInit() {
    this.appSource = environment.app_source;
  }

  confirmDelete() {
    this.dialogRef.close(true);
  }

}

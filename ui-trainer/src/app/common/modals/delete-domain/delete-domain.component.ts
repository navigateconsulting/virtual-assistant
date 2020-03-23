import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-delete-domain',
  templateUrl: './delete-domain.component.html',
  styleUrls: ['./delete-domain.component.scss']
})
export class DeleteDomainComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteDomainComponent>) { }

  ngOnInit() {}

  confirmDelete() {
    this.dialogRef.close(true);
  }

}

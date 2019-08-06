import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-delete-response',
  templateUrl: './delete-response.component.html',
  styleUrls: ['./delete-response.component.scss']
})
export class DeleteResponseComponent implements OnInit {

  appSource: string;

  constructor(public dialogRef: MatDialogRef<DeleteResponseComponent>) { }

  ngOnInit() {
    this.appSource = environment.app_source;
  }

  confirmDelete() {
    this.dialogRef.close(true);
  }

}

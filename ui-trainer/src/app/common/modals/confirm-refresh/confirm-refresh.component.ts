import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-refresh',
  templateUrl: './confirm-refresh.component.html',
  styleUrls: ['./confirm-refresh.component.scss']
})
export class ConfirmRefreshComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmRefreshComponent>) { }

  ngOnInit() {
  }

  confirmDelete() {
    this.dialogRef.close(true);
  }

}

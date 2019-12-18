import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-action',
  templateUrl: './delete-action.component.html',
  styleUrls: ['./delete-action.component.scss']
})
export class DeleteActionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteActionComponent>) { }

  ngOnInit() {
  }

  confirmDelete() {
    this.dialogRef.close(true);
  }

}

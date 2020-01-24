import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-response',
  templateUrl: './delete-response.component.html',
  styleUrls: ['./delete-response.component.scss']
})
export class DeleteResponseComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteResponseComponent>) { }

  ngOnInit() {}

  confirmDelete() {
    this.dialogRef.close(true);
  }

}

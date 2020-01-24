import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-intent',
  templateUrl: './delete-intent.component.html',
  styleUrls: ['./delete-intent.component.scss']
})
export class DeleteIntentComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteIntentComponent>) { }

  ngOnInit() {}

  confirmDelete() {
    this.dialogRef.close(true);
  }

}

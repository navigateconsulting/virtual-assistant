import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-delete-intent',
  templateUrl: './delete-intent.component.html',
  styleUrls: ['./delete-intent.component.scss']
})
export class DeleteIntentComponent implements OnInit {

  appSource: string;

  constructor(public dialogRef: MatDialogRef<DeleteIntentComponent>) { }

  ngOnInit() {
    this.appSource = environment.app_source;
  }

  confirmDelete() {
    this.dialogRef.close(true);
  }

}

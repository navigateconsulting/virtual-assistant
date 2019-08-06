import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-delete-story',
  templateUrl: './delete-story.component.html',
  styleUrls: ['./delete-story.component.scss']
})
export class DeleteStoryComponent implements OnInit {

  appSource: string;

  constructor(public dialogRef: MatDialogRef<DeleteStoryComponent>) { }

  ngOnInit() {
    this.appSource = environment.app_source;
  }

  confirmDelete() {
    this.dialogRef.close(true);
  }

}

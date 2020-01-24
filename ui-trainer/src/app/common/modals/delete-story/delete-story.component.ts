import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-story',
  templateUrl: './delete-story.component.html',
  styleUrls: ['./delete-story.component.scss']
})
export class DeleteStoryComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteStoryComponent>) { }

  ngOnInit() {}

  confirmDelete() {
    this.dialogRef.close(true);
  }

}

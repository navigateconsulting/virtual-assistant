import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss']
})
export class DeleteProjectComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteProjectComponent>) { }

  ngOnInit() {
  }

  confirmDelete() {
    this.dialogRef.close(true);
  }

}

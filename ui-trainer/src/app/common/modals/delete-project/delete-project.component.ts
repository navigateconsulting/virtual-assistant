import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss']
})
export class DeleteProjectComponent implements OnInit {

  appSource: string;

  constructor(public dialogRef: MatDialogRef<DeleteProjectComponent>) { }

  ngOnInit() {
    this.appSource = environment.app_source;
  }

  confirmDelete() {
    this.dialogRef.close(true);
  }

}

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-deploy-model',
  templateUrl: './deploy-model.component.html',
  styleUrls: ['./deploy-model.component.scss']
})
export class DeployModelComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeployModelComponent>) { }

  ngOnInit() {
  }

  confirmDeploy() {
    this.dialogRef.close(true);
  }

}

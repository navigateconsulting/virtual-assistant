import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-deploy-model',
  templateUrl: './deploy-model.component.html',
  styleUrls: ['./deploy-model.component.scss']
})
export class DeployModelComponent implements OnInit {

  appSource: string;

  constructor(public dialogRef: MatDialogRef<DeployModelComponent>) { }

  ngOnInit() {
    this.appSource = environment.app_source;
  }

  confirmDeploy() {
    this.dialogRef.close(true);
  }

}

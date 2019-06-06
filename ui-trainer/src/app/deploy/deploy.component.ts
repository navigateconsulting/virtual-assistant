import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';

import { WebSocketService } from '../common/services/web-socket.service';
import { NotificationsService } from '../common/services/notifications.service';

import { DeployModelComponent } from '../common/modals/deploy-model/deploy-model.component';

@Component({
  selector: 'app-deploy',
  templateUrl: './deploy.component.html',
  styleUrls: ['./deploy.component.scss']
})
export class DeployComponent implements OnInit {

  projectModels: any;

  constructor(public dialog: MatDialog,
              public webSocketService: WebSocketService,
              public notificationsService: NotificationsService) { }

  projectsModelDisplayedColumns: string[] = ['icon', 'project_name', 'source', 'model_name', 'state', 'deploy'];
  projectsModelDataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getProjectsForDeploy();
  }

  getProjectsForDeploy() {
    this.webSocketService.createProjectDeployNSP();
    this.webSocketService.getProjectsForDeploy().subscribe(projects => {
      this.projectModels = (projects !== '' && projects !== null) ? projects : [];
      if (this.projectModels.length === 0) {
        this.projectModels = new Array<object>();
      }
      this.projectsModelDataSource = new MatTableDataSource(this.projectModels);
      this.projectsModelDataSource.paginator = this.paginator;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.webSocketService.getModelDeployAlerts().subscribe(response => {
      if (response) {
        this.notificationsService.showToast(response);
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  applyModelsFilter(filterValue: string) {
    this.projectsModelDataSource.filter = filterValue.trim().toLowerCase();
  }

  deployModel(projectObjectId: string) {
    const dialogRef = this.dialog.open(DeployModelComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.deployModel(projectObjectId);
      }
    });
  }

}

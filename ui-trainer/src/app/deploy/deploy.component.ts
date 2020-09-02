import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService } from '../common/services/notifications.service';
import { OverlayService } from '../common/services/overlay.service';
import { ModelErrorService } from '../common/services/model-error.service';
import { SharedDataService } from '../common/services/shared-data.service';
import { DeployModelComponent } from '../common/modals/deploy-model/deploy-model.component';
import { ApiService } from '../common/services/apis.service';
import { ShowTrainErrorComponent } from '../common/modals/show-train-error/show-train-error.component';

@Component({
  selector: 'app-deploy',
  templateUrl: './deploy.component.html',
  styleUrls: ['./deploy.component.scss']
})
export class DeployComponent implements OnInit, OnDestroy {

  projectModels: any;
  session_id: string;

  constructor(public dialog: MatDialog,
              public apiService: ApiService,
              public overlayService: OverlayService,
              public modelErrorService: ModelErrorService,
              public sharedDataService: SharedDataService,
              public notificationsService: NotificationsService) {}

  projectsModelDisplayedColumns: string[] = ['icon', 'project_name', 'source', 'model_name', 'deploy'];
  projectsModelDataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    sessionStorage.setItem('currentPage', 'deploy');
    this.getProjectsForDeploy();
    this.paginator.pageIndex = +localStorage.getItem('deploy_pageIndex');
    this.paginator.pageSize = +localStorage.getItem('deploy_pageSize');
    this.session_id = ''; // this.webSocketService.getSessionId();
  }

  getProjectsForDeploy() {
    this.apiService.requestProjects().subscribe(projects => {
      this.projectModels = projects;
      this.projectsModelDataSource = new MatTableDataSource(this.projectModels);
      this.projectsModelDataSource.paginator = this.paginator;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  applyModelsFilter(filterValue: string) {
    this.projectsModelDataSource.filter = filterValue.trim().toLowerCase();
  }

  deployModel(projectModelName: string) {
    const dialogRef = this.dialog.open(DeployModelComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.overlayService.spin$.next(true);
        this.apiService.deployTrainedModel(projectModelName).subscribe(result => {
          this.overlayService.spin$.next(false);
          this.notificationsService.showToast({status: 'Success', message: 'Model Deployed Successfully'});
          this.apiService.forceProjectsCacheReload('reset');
          this.getProjectsForDeploy();
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
      }
    });
  }

  getDeployPaginatorData(event: any) {
    localStorage.setItem('deploy_pageIndex', event.pageIndex);
    localStorage.setItem('deploy_pageSize', event.pageSize);
  }

  finishTraining() {
    this.apiService.forceModelTrainingCacheReload('finish');
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('currentPage');
    this.overlayService.spin$.next(false);
    this.dialog.closeAll();
  }

}

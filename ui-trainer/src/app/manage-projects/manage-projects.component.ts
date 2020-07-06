import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectComponent } from '../common/modals/add-project/add-project.component';
import { EditProjectComponent } from '../common/modals/edit-project/edit-project.component';
import { DeleteProjectComponent } from '../common/modals/delete-project/delete-project.component';
import { CopyProjectComponent } from '../common/modals/copy-project/copy-project.component';
import { NotificationsService } from '../common/services/notifications.service';
import { SharedDataService } from '../common/services/shared-data.service';
import { constant } from '../../environments/constants';
import { AppPropComponent } from '../common/modals/app-prop/app-prop.component';
import { ApiService } from '../common/services/apis.service';
import { ShowTrainErrorComponent } from '../common/modals/show-train-error/show-train-error.component';

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.scss']
})
export class ManageProjectsComponent implements OnInit, OnDestroy {

  constructor(public notificationsService: NotificationsService,
              public sharedDataService: SharedDataService,
              public dialog: MatDialog,
              public apiService: ApiService) {}

  // tslint:disable-next-line: max-line-length
  projectsDisplayedColumns: string[] = ['icon', 'project_name', 'padding1', 'project_description', 'padding2', 'source', 'state', 'edit', 'delete', 'copy', 'train', 'try_now', 'properties', 'export'];
  projectsDataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  currentPath: string;
  currentPathID: string;
  currentType: string;
  canNavigateUp = false;
  openIntentORStoryORResponseFile: string;
  propertyPanel: string;
  projects_json: Array<object>;
  showSpinner: Array<boolean>;

  @Output() selectedProject = new EventEmitter<object>();

  ngOnInit() {
    this.projects_json = new Array<object>();
    this.getProjects();
    this.paginator.pageIndex = +localStorage.getItem('projects_pageIndex');
    this.paginator.pageSize = +localStorage.getItem('projects_pageSize');
  }

  getProjects() {
    this.apiService.requestProjects().subscribe(projects => {
      this.projects_json = projects;
      this.showSpinner = new Array<boolean>();
      for (let i = 0; i < this.projects_json.length; i ++) {
        this.showSpinner.push(false);
      }
      console.log(this.showSpinner);
      this.projectsDataSource = new MatTableDataSource(this.projects_json);
      this.projectsDataSource.paginator = this.paginator;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  addNewProject() {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      height: '320px',
      width: '345px',
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        response['configuration'] = constant.DEFAULT_RASA_CONFIG;
        this.apiService.createProject(response).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
      }
    });
  }

  editProject(projectObjectId: string, projectName: string, projectDescription: string) {
    const dialogRef = this.dialog.open(EditProjectComponent, {
      height: '320px',
      width: '345px',
      data: {projectObjectId: projectObjectId, projectName: projectName, projectDescription: projectDescription}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.apiService.editProject(response).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
      }
    });
  }

  deleteProject(projectObjectId: string) {
    const dialogRef = this.dialog.open(DeleteProjectComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.apiService.deleteProject(projectObjectId).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
      }
    });
  }

  copyProject(projectObjectId: string, projectName: string) {
    const dialogRef = this.dialog.open(CopyProjectComponent, {
      height: '320px',
      width: '345px',
      data: {projectObjectId: projectObjectId, projectName: projectName}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.apiService.copyProject(response).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
      }
    });
  }

  trainProject(projectObjectId: string, index: number) {
    console.log(index);
    this.showSpinner[index] = true;
    this.apiService.requestModelTraining(projectObjectId).subscribe(response => {
      if (response['status'] === 'Success' && response['message'] === 'PENDING') {
        this.notificationsService.showToast({status: 'Info', message: 'Model Is Getting Trained.'});
        this.checkModelTrainStatus(projectObjectId, response['task_id'], index);
      } else if (response['status'] === 'Error') {
        const dialogRef = this.dialog.open(ShowTrainErrorComponent, {
          width: '700px',
          data: {errorMessage: response['message']}
        });
        dialogRef.afterClosed().subscribe(() => {});
        this.showSpinner[index] = false;
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  checkModelTrainStatus(projectObjectId: string, taskId: string, index: number) {
    this.apiService.forceModelTrainingCacheReload('reset');
    this.apiService.checkModelTrainStatus(taskId).subscribe(response => {
      if (response['Status'] === 'SUCCESS') {
        this.getModelTrainResult(projectObjectId, taskId, index);
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  getModelTrainResult(projectObjectId: string, taskId: string, index: number) {
    this.apiService.getModelTrainingResult(taskId).subscribe(response => {
      if (response['Status'] === 'Success') {
        sessionStorage.setItem(projectObjectId, response['Message']);
        this.notificationsService.showToast({status: response['Status'], message: 'Model Training Complete.'});
      } else if (response['Status'] === 'Error') {
        const dialogRef = this.dialog.open(ShowTrainErrorComponent, {
          width: '700px',
          data: {errorMessage: response['Message']}
        });
        dialogRef.afterClosed().subscribe(() => {});
      }
      this.finishTraining(index);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  finishTraining(index: number) {
    this.showSpinner[index] = false;
    this.apiService.forceModelTrainingCacheReload('finish');
  }

  tryNowProject(projectStub: any) {
    if (sessionStorage.getItem(projectStub._id.$oid) !== null) {
      this.sharedDataService.setSharedData('projectObjectId', projectStub._id.$oid, constant.MODULE_COMMON);
      this.selectedProject.emit({projectStub: projectStub, component: 'try-now'});
    } else {
      this.notificationsService.showToast({status: 'Error', message: 'Kindly Train The Model First.'});
    }
  }

  openProjectProperties(projectObjectId: any, projectConfiguration: any) {
    const dialogRef = this.dialog.open(AppPropComponent, {
      height: '550px',
      width: '650px',
      data: {projectObjectId: projectObjectId, projectConfiguration: projectConfiguration}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.apiService.editProject(response).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
      }
    });
  }

  importProject(file: File) {
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = () => {
      this.apiService.importProject(JSON.parse(fileReader.result.toString())).subscribe(result => {
        if (result) {
          this.notificationsService.showToast(result);
          this.forceReload();
        }
      },
      err => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification'));
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }

  exportProject(projectName: any) {
    this.apiService.exportProject(projectName).subscribe(result => {
      let sJson = JSON.stringify(result);
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
      element.setAttribute('download', projectName + '.json');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click(); // simulate click
      document.body.removeChild(element);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  selectProject(projectStub: any) {
    this.selectedProject.emit({projectStub: projectStub, component: 'manage-domains'});
  }

  applyProjectsFilter(filterValue: string) {
    this.projectsDataSource.filter = filterValue.trim().toLowerCase();
  }

  showErrorOnProject() {
    this.notificationsService.showToast({status: 'Error', message: 'No changes can be made to a project in published / archived state'});
  }

  getProjectsPaginatorData(event: any) {
    localStorage.setItem('projects_pageIndex', event.pageIndex);
    localStorage.setItem('projects_pageSize', event.pageSize);
  }

  forceReload() {
    this.apiService.forceProjectsCacheReload('reset');
    this.getProjects();
  }

  ngOnDestroy(): void {
    this.apiService.forceProjectsCacheReload('finish');
    this.dialog.closeAll();
  }

}

import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../common/services/web-socket.service';
import { AddProjectComponent } from '../common/modals/add-project/add-project.component';
import { EditProjectComponent } from '../common/modals/edit-project/edit-project.component';
import { DeleteProjectComponent } from '../common/modals/delete-project/delete-project.component';
import { CopyProjectComponent } from '../common/modals/copy-project/copy-project.component';
import { NotificationsService } from '../common/services/notifications.service';
import { SharedDataService } from '../common/services/shared-data.service';
import { constant } from '../../environments/constants';
import { AppPropComponent } from '../common/modals/app-prop/app-prop.component';
import { ImportExportService } from '../common/services/import-export.service';

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.scss']
})
export class ManageProjectsComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  constructor(public webSocketService: WebSocketService,
              public importExportService: ImportExportService,
              public notificationsService: NotificationsService,
              public sharedDataService: SharedDataService,
              public dialog: MatDialog) {}

  // tslint:disable-next-line: max-line-length
  projectsDisplayedColumns: string[] = ['icon', 'project_name', 'padding1', 'project_description', 'padding2', 'created_by', 'state', 'source', 'edit', 'delete', 'copy', 'try_now', 'properties', 'export'];
  projectsDataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  currentPath: string;
  currentPathID: string;
  currentType: string;
  canNavigateUp = false;
  openIntentORStoryORResponseFile: string;
  propertyPanel: string;
  projects_json: Array<object>;

  @Output() selectedProject = new EventEmitter<object>();

  ngOnInit() {
    this.projects_json = new Array<object>();
    this.getProjects();
    this.paginator.pageIndex = +localStorage.getItem('projects_pageIndex');
    this.paginator.pageSize = +localStorage.getItem('projects_pageSize');
  }

  getProjects() {
    this.webSocketService.createProjectsRoom('root');
    this.webSocketService.getProjects('root').subscribe(projects => {
      this.projects_json = projects;
      this.projectsDataSource = new MatTableDataSource(this.projects_json);
      this.projectsDataSource.paginator = this.paginator;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.subscription.add(this.webSocketService.getProjectAlerts().subscribe(response => {
      this.notificationsService.showToast(response);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification')));
  }

  addNewProject() {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      height: '320px',
      width: '345px',
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        response['configuration'] = constant.DEFAULT_RASA_CONFIG;
        this.webSocketService.createProject(response, 'root');
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
        this.webSocketService.editProject(response, 'root');
      }
    });
  }

  deleteProject(projectObjectId: string) {
    const dialogRef = this.dialog.open(DeleteProjectComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.deleteProject(projectObjectId, 'root');
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
        this.webSocketService.copyProject(response, 'root');
      }
    });
  }

  tryNowProject(projectStub: any) {
    this.webSocketService.leaveProjectsRoom('root');
    this.sharedDataService.setSharedData('projectObjectId', projectStub._id.$oid, constant.MODULE_COMMON);
    this.selectedProject.emit({projectStub: projectStub, component: 'try-now'});
  }

  openProjectProperties(projectObjectId: any, projectConfiguration: any) {
    const dialogRef = this.dialog.open(AppPropComponent, {
      height: '550px',
      width: '650px',
      data: {projectObjectId: projectObjectId, projectConfiguration: projectConfiguration}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.editProject(response, 'root');
      }
    });
  }

  importProject(file: File) {
    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = () => {
      this.importExportService.importProject(JSON.parse(fileReader.result.toString())).subscribe(result => {
        if (result) {
          this.notificationsService.showToast({status: result['status'], message: result['message']}); 
          if (result['status'] === 'Success') {
            this.getProjects();
          }
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
    this.importExportService.exportProject(projectName).subscribe(result => {
      var sJson = JSON.stringify(result);
      var element = document.createElement('a');
      element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
      element.setAttribute('download', projectName + ".json");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click(); // simulate click
      document.body.removeChild(element);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  selectProject(projectStub: any) {
    this.webSocketService.leaveProjectsRoom('root');
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.webSocketService.leaveProjectsRoom('root');
    this.dialog.closeAll();
  }

}

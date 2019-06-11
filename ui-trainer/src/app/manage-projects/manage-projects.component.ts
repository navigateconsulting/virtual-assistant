import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { WebSocketService } from '../common/services/web-socket.service';
import { AddProjectComponent } from '../common/modals/add-project/add-project.component';
import { EditProjectComponent } from '../common/modals/edit-project/edit-project.component';
import { DeleteProjectComponent } from '../common/modals/delete-project/delete-project.component';
import { CopyProjectComponent } from '../common/modals/copy-project/copy-project.component';
import { NotificationsService } from '../common/services/notifications.service';
import { SharedDataService } from '../common/services/shared-data.service';
import { Router } from '@angular/router';
import { constant } from '../../environments/constants';

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.scss']
})
export class ManageProjectsComponent implements OnInit, OnDestroy {

  constructor(public webSocketService: WebSocketService,
              public notificationsService: NotificationsService,
              public sharedDataService: SharedDataService,
              public dialog: MatDialog) {}

// tslint:disable-next-line: max-line-length
  projectsDisplayedColumns: string[] = ['icon', 'project_name', 'project_description', 'created_by', 'state', 'source', 'edit', 'delete', 'copy', 'try_now'];
  projectsDataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  currentPath: string;
  currentPathID: string;
  currentType: string;
  canNavigateUp = false;
  showAddFolderFile = true;
  openIntentORStoryORResponseFile: string;
  propertyPanel: string;

  rootFoldersArray: Array<string> = ['Intents', 'Stories', 'Responses'];

  projectsJSON: any;
  domainsJSON: any;

  @Output() selectedProject = new EventEmitter<object>();

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this.webSocketService.createProjectsRoom('root');
    this.webSocketService.getProjects('root').subscribe(projects => {
      this.projectsJSON = (projects !== '' && projects !== null) ? projects : [];
      if (this.projectsJSON.length === 0) {
        this.projectsJSON = new Array<object>();
      }
      this.projectsDataSource = new MatTableDataSource(this.projectsJSON);
      this.projectsDataSource.paginator = this.paginator;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.webSocketService.getProjectAlerts().subscribe(response => {
      this.notificationsService.showToast(response);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  addNewProject() {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.createProject(response, 'root');
      }
    });
  }

  editProject(projectObjectId: string, projectName: string, projectDescription: string) {
    const dialogRef = this.dialog.open(EditProjectComponent, {
      width: '400px',
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
      width: '400px',
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

  ngOnDestroy(): void {
    this.webSocketService.leaveProjectsRoom('root');
  }

}

import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { FileElement } from '../file-explorer/model/element';
import { Observable } from 'rxjs';
import { FileService } from '../common/services/file.service';
import { WebSocketService } from '../common/services/web-socket.service';
import { AddProjectComponent } from '../common/modals/add-project/add-project.component';
import { EditProjectComponent } from '../common/modals/edit-project/edit-project.component';
import { DeleteProjectComponent } from '../common/modals/delete-project/delete-project.component';
import { CopyProjectComponent } from '../common/modals/copy-project/copy-project.component';


@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.scss']
})
export class ManageProjectsComponent implements OnInit, OnDestroy {

  constructor(public fileService: FileService,
              public webSocketService: WebSocketService,
              public dialog: MatDialog) {}

// tslint:disable-next-line: max-line-length
  projectsDisplayedColumns: string[] = ['icon', 'project_name', 'project_description', 'created_by', 'status', 'source', 'edit', 'delete', 'copy'];
  projectsDataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public fileElements: Observable<FileElement[]>;
  currentRoot: FileElement;
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
  show_success_error: boolean;
  success_error_class: string;
  success_error_type: string;
  success_error_message: string;

  @Output() selectedProject = new EventEmitter<string>();

  ngOnInit() {
    this.show_success_error = false;
    this.getProjects();
    // this.currentPath = '<span class="root pseudolink"> Home </span>' + ' / ';
    // this.currentType = 'project';
    // this.propertyPanel = 'entities';
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

    this.webSocketService.getProjectAlerts().subscribe(projects => {
      this.showProjectAlerts(projects);
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

  selectProject(projectObjectId: string) {
    this.webSocketService.leaveProjectsRoom('root');
    this.selectedProject.emit(projectObjectId);
  }

  showProjectAlerts(res: any) {
    if (res.status === 'Error') {
      this.success_error_class = 'danger';
    } else if (res.status === 'Success') {
      this.success_error_class = 'success';
    }
    this.success_error_type = res.status;
    this.success_error_message = res.message;
    this.show_success_error = true;
    setTimeout(() => {
      this.show_success_error = false;
    }, 2000);
  }

  // getDomains(pelement_id, project_id) {
  //   this.webSocketService.createDomainsRoom('project_' + project_id);
  //   this.connection = this.webSocketService.getDomains(project_id, 'project_' + project_id).subscribe(domains => {
  //     this.domainsJSON = (domains !== '' && domains !== null) ? domains : [];
  //     if (this.domainsJSON.length === 0) {
  //       this.domainsJSON = new Array<object>();
  //     }
  //     this.createDomainsFolder(this.domainsJSON, pelement_id);
  //   },
  //   err => console.error('Observer got an error: ' + err),
  //   () => console.log('Observer got a complete notification'));
  // }

  // createProjectsFolder(projects_json: any) {
  //   console.log(projects_json);
  //   // this.fileService.clearProjectsMapElement();
  //   // projects_json.forEach(project => {
  //   //   // tslint:disable-next-line: max-line-length
  //   //   this.fileService.addProjectFolder({ oid: project._id['$oid'], project_id: project.project_id, name: project.project_name, description: project.project_description, isFolder: true, parent: 'root', type: 'project' });
  //   // });
  //   // this.updateFileElementQuery();
  // }

  applyProjectsFilter(filterValue: string) {
    this.projectsDataSource.filter = filterValue.trim().toLowerCase();
  }

  createDomainsFolder(domains_json: any, pelement_id: string) {
    console.log(domains_json);
    this.fileService.clearDomainsMapElement();
    domains_json.forEach(domain => {
      // tslint:disable-next-line: max-line-length
      this.fileService.addDomainFolder({ oid: domain._id['$oid'], project_id: domain.domain_id, name: domain.domain_name, description: domain.domain_description, isFolder: true, parent: pelement_id, type: 'domain' });
    });
    this.updateFileElementQuery();
  }

  navigateToFolder(element: FileElement) {
    const isFile = false;
    if (element.parent === 'root') {
      this.showAddFolderFile = true;
      this.webSocketService.leaveProjectsRoom('root');
      // this.getDomains(element.id, element.project_id);
    }
    // if (element.parent === 'root') {
    //   this.showAddFolderFile = false;
    //   sessionStorage.setItem('domain_id', '' + element.domain_id);
    // } else if (this.rootFoldersArray.includes(element.name)) {
    //   this.showAddFolderFile = true;
    // } else {
    //   this.showAddFolderFile = false;
    //   this.showIntentORStoryORResponse(element);
    //   isFile = true;
    // }
    this.currentRoot = element;
    this.currentPath = this.pushToPath(this.currentPath, element.name, element.id, isFile);
    this.canNavigateUp = true;
    this.updateFileElementQuery();
  }

  pushToPath(path: string, folderName: string, elementId: string, isFile: boolean) {
    let p = path ? path : '';
    if (isFile) {
      // tslint:disable-next-line:quotemark
      p += folderName;
    } else {
      // tslint:disable-next-line:quotemark
      p += "<span class='" + elementId + "'>" + `${folderName}` + "</span>" + ' / ';
    }
    return p;
  }

  popFromPath(path: string, path_class: string) {
    let index = 0;
    let p = path ? path : '';
    const split = p.split(' / ');
    for (let i = 0; i < split.length; i++) {
      if (split[i].includes(path_class)) {
        index = i;
      }
    }
    split.splice(index + 1);
    p = split.join(' / ') + ' / ';
    return p;
  }

  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }

  ngOnDestroy(): void {}

}

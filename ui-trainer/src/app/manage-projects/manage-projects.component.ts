import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileElement } from '../file-explorer/model/element';
import { Observable } from 'rxjs';
import { FileService } from '../common/services/file.service';
import { WebSocketService } from '../common/services/web-socket.service';


@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.scss']
})
export class ManageProjectsComponent implements OnInit, OnDestroy {

  constructor(public fileService: FileService,
              public webSocketService: WebSocketService) {}

  public fileElements: Observable<FileElement[]>;
  currentRoot: FileElement;
  currentPath: string;
  currentPathID: string;
  currentType: string;
  canNavigateUp = false;
  showAddFolderFile = true;
  openIntentORStoryORResponseFile: string;
  connection: any;
  propertyPanel: string;

  rootFoldersArray: Array<string> = ['Intents', 'Stories', 'Responses'];

  projectsJSON: any;
  domainsJSON: any;

  ngOnInit() {
    // this.connection = this.domainsService.getDomains('1', '2').subscribe(message => {
    //   console.log('Heer NGONINIT', message);
    // },
    // err => console.error('Observer got an error: ' + err),
    // () => console.log('Observer got a complete notification'));
    this.getProjects();
    // this.getDomains('1', '2');
    this.currentPath = '<span class="root pseudolink"> Home </span>' + ' / ';
    this.currentType = 'project';
    this.propertyPanel = 'entities';
  }

  getProjects() {
    this.webSocketService.createProjectsRoom('root');
    this.connection = this.webSocketService.getProjects('root').subscribe(projects => {
      this.projectsJSON = (projects !== '' && projects !== null) ? projects : [];
      if (this.projectsJSON.length === 0) {
        this.projectsJSON = new Array<object>();
      }
      this.createProjectsFolder(this.projectsJSON);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  getDomains(pelement_id, project_id) {
    this.webSocketService.createDomainsRoom('project_' + project_id);
    this.connection = this.webSocketService.getDomains(project_id, 'project_' + project_id).subscribe(domains => {
      this.domainsJSON = (domains !== '' && domains !== null) ? domains : [];
      if (this.domainsJSON.length === 0) {
        this.domainsJSON = new Array<object>();
      }
      this.createDomainsFolder(this.domainsJSON, pelement_id);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  createProjectsFolder(projects_json: any) {
    console.log(projects_json);
    this.fileService.clearProjectsMapElement();
    projects_json.forEach(project => {
      // tslint:disable-next-line: max-line-length
      this.fileService.addProjectFolder({ oid: project._id['$oid'], project_id: project.project_id, name: project.project_name, description: project.project_description, isFolder: true, parent: 'root', type: 'project' });
    });
    this.updateFileElementQuery();
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
      this.getDomains(element.id, element.project_id);
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

  ngOnDestroy(): void {
    this.connection.unsubscribe();
  }

}

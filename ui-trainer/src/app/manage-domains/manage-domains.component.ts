import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../common/services/web-socket.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDomainComponent } from '../common/modals/add-domain/add-domain.component';
import { DeleteDomainComponent } from '../common/modals/delete-domain/delete-domain.component';
import { EditDomainComponent } from '../common/modals/edit-domain/edit-domain.component';
import { NotificationsService } from '../common/services/notifications.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-manage-domains',
  templateUrl: './manage-domains.component.html',
  styleUrls: ['./manage-domains.component.scss']
})
export class ManageDomainsComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  constructor(public webSocketService: WebSocketService,
              public notificationsService: NotificationsService,
              public dialog: MatDialog) { }

  currentPath: string;
  currentPathID: string;
  canNavigateUp = false;
  showAddFolderFile = true;
  openIntentORStoryORResponseFile: string;
  currentIntent: any;
  currentStory: any;
  currentResponse: any;
  domain_id: number;
  intent_id: number;
  story_id: number;
  response_id: number;
  intentsJSON: any;
  storiesJSON: any;
  responsesJSON: any;
  domainsJSON: any;
  projectsJSON: any;
  propertyPanel: string;
  rootFoldersArray: Array<string> = ['Intents', 'Stories', 'Responses'];

  connection: any;
  domains_json: Array<object>;
  domains_json_backup: Array<object>;
  appSource: string;

  @Input() projectObjectId: string;

  @Output() selectedDomain = new EventEmitter<string>();

  ngOnInit() {
    this.appSource = environment.app_source;
    this.domains_json = new Array<object>();
    this.domains_json_backup = new Array<object>();
    this.getDomains();
  }

  getDomains() {
    this.webSocketService.createDomainsRoom('project_' + this.projectObjectId);
    this.webSocketService.getDomains(this.projectObjectId, 'project_' + this.projectObjectId).subscribe(domains => {
      this.domains_json = this.domains_json_backup = domains;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.subscription.add(this.webSocketService.getDomainAlerts().subscribe(response => {
      this.notificationsService.showToast(response);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification')));
  }

  addNewDomain() {
    const dialogRef = this.dialog.open(AddDomainComponent, {
      height: '320px',
      width: '345px',
      data: {projectObjectId: this.projectObjectId}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.createDomain(response, 'project_' + this.projectObjectId);
      }
    });
  }

  editDomain(domainObjectId: string, domainName: string, domainDescription: string) {
    const dialogRef = this.dialog.open(EditDomainComponent, {
      height: '320px',
      width: '345px',
      data: {
        projectObjectId: this.projectObjectId,
        domainObjectId: domainObjectId,
        domainName: domainName,
        domainDescription: domainDescription
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.editDomain(response, 'project_' + this.projectObjectId);
      }
    });
  }

  deleteDomain(domainObjectId: string) {
    const dialogRef = this.dialog.open(DeleteDomainComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        // tslint:disable-next-line: max-line-length
        this.webSocketService.deleteDomain({project_id: this.projectObjectId, object_id: domainObjectId}, 'project_' + this.projectObjectId);
      }
    });
  }

  applyDomainsFilter(filterValue: string) {
    this.domains_json = this.domains_json_backup;
    this.domains_json = this.domains_json.filter((value) => {
      // tslint:disable-next-line: max-line-length
      if (value['domain_name'].includes(filterValue.trim()) || value['domain_name'].toLowerCase().includes(filterValue.trim()) || value['domain_name'].toUpperCase().includes(filterValue.trim()) || value['domain_description'].includes(filterValue.trim()) || value['domain_description'].toLowerCase().includes(filterValue.trim()) || value['domain_description'].toUpperCase().includes(filterValue.trim())) {
        return value;
      }
    });
  }

  selectDomain(domainStub: any) {
    this.webSocketService.leaveDomainsRoom('project_' + this.projectObjectId);
    this.selectedDomain.emit(domainStub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.webSocketService.leaveDomainsRoom('project_' + this.projectObjectId);
    this.dialog.closeAll();
  }
}

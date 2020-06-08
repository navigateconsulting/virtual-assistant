import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDomainComponent } from '../common/modals/add-domain/add-domain.component';
import { DeleteDomainComponent } from '../common/modals/delete-domain/delete-domain.component';
import { EditDomainComponent } from '../common/modals/edit-domain/edit-domain.component';
import { NotificationsService } from '../common/services/notifications.service';
import { ApiService } from '../common/services/apis.service';

@Component({
  selector: 'app-manage-domains',
  templateUrl: './manage-domains.component.html',
  styleUrls: ['./manage-domains.component.scss']
})
export class ManageDomainsComponent implements OnInit, OnDestroy {

  constructor(public apiService: ApiService,
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

  @Input() projectObjectId: string;

  @Output() selectedDomain = new EventEmitter<string>();

  ngOnInit() {
    this.domains_json = new Array<object>();
    this.domains_json_backup = new Array<object>();
    this.forceReload();
  }

  getDomains() {
    this.apiService.requestDomains(this.projectObjectId).subscribe(domains => {
      if (domains) {
        console.log(domains);
        this.domains_json = this.domains_json_backup = domains;
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  addNewDomain() {
    const dialogRef = this.dialog.open(AddDomainComponent, {
      height: '320px',
      width: '345px',
      data: {projectObjectId: this.projectObjectId}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.apiService.createDomain(response, this.projectObjectId).subscribe(result => {
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
        this.apiService.editDomain(response, this.projectObjectId).subscribe(result => {
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

  deleteDomain(domainObjectId: string) {
    const dialogRef = this.dialog.open(DeleteDomainComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        // tslint:disable-next-line: max-line-length
        this.apiService.deleteDomain(domainObjectId, this.projectObjectId).subscribe(result => {
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
    // this.webSocketService.leaveDomainsRoom('project_' + this.projectObjectId);
    this.selectedDomain.emit(domainStub);
  }

  forceReload() {
    this.apiService.forceDomainsCacheReload('reset');
    this.getDomains();
  }

  ngOnDestroy(): void {
    this.apiService.forceDomainsCacheReload('finish');
    this.dialog.closeAll();
  }
}

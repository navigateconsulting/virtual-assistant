import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { WebSocketService } from '../common/services/web-socket.service';
import { AddIntentComponent } from '../common/modals/add-intent/add-intent.component';
import { EditIntentComponent } from '../common/modals/edit-intent/edit-intent.component';
import { DeleteIntentComponent } from '../common/modals/delete-intent/delete-intent.component';
import { AddResponseComponent } from '../common/modals/add-response/add-response.component';
import { EditResponseComponent } from '../common/modals/edit-response/edit-response.component';
import { DeleteResponseComponent } from '../common/modals/delete-response/delete-response.component';
import { AddStoryComponent } from '../common/modals/add-story/add-story.component';
import { EditStoryComponent } from '../common/modals/edit-story/edit-story.component';
import { DeleteStoryComponent } from '../common/modals/delete-story/delete-story.component';
import { NotificationsService } from '../common/services/notifications.service';
import { Subscription } from 'rxjs';
import { SharedDataService } from '../common/services/shared-data.service';
import { constant } from '../../environments/constants';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-manage-irs',
  templateUrl: './manage-irs.component.html',
  styleUrls: ['./manage-irs.component.scss']
})
export class ManageIrsComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  constructor(public webSocketService: WebSocketService,
              public notificationsService: NotificationsService,
              public dialog: MatDialog,
              public sharedDataService: SharedDataService) { }

  @Input() projectObjectId: string;
  @Input() domainObjectId: string;
  @Output() selectedIRS = new EventEmitter<object>();
  @ViewChild('intentsPaginator', {read: MatPaginator}) intentsPaginator: MatPaginator;
  @ViewChild('responsesPaginator', {read: MatPaginator}) responsesPaginator: MatPaginator;
  @ViewChild('storiesPaginator', {read: MatPaginator}) storiesPaginator: MatPaginator;

  intentsDisplayedColumns: string[] = ['icon', 'intent_name', 'intent_description', 'edit', 'delete'];
  intents_json: Array<object>;
  intentsDataSource: any;
  responsesDisplayedColumns: string[] = ['icon', 'response_name', 'response_description', 'edit', 'delete'];
  responses_json: Array<object>;
  responsesDataSource: any;
  storiesDisplayedColumns: string[] = ['icon', 'story_name', 'story_description', 'edit', 'delete'];
  stories_json: Array<object>;
  storiesDataSource: any;
  activeTabIndex: any;
  appSource: string;

  ngOnInit() {
    this.appSource = environment.app_source;
    this.intents_json = new Array<object>();
    this.responses_json = new Array<object>();
    this.stories_json = new Array<object>();
    this.activeTabIndex = this.sharedDataService.getSharedData('activeTabIndex', constant.MODULE_COMMON);
    if (this.activeTabIndex === undefined) {
      this.activeTabIndex = '0';
    }
    this.webSocketService.createIRSRoom('domain_' + this.domainObjectId);
    this.getIntents();
    this.getResponses();
    this.getStories();
    this.intentsPaginator.pageIndex = +localStorage.getItem('intents_pageIndex');
    this.intentsPaginator.pageSize = +localStorage.getItem('intents_pageSize');
    this.responsesPaginator.pageIndex = +localStorage.getItem('responses_pageIndex');
    this.responsesPaginator.pageSize = +localStorage.getItem('responses_pageSize');
    this.storiesPaginator.pageIndex = +localStorage.getItem('stories_pageIndex');
    this.storiesPaginator.pageSize = +localStorage.getItem('stories_pageSize');
  }

  getIntents() {
    const project_domain_ids = {project_id: this.projectObjectId, domain_id: this.domainObjectId};
    this.webSocketService.getIntents(project_domain_ids, 'domain_' + this.domainObjectId).subscribe(intents => {
      this.intents_json = intents;
      this.intentsDataSource = new MatTableDataSource(intents);
      this.intentsDataSource.paginator = this.intentsPaginator;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.subscription.add(this.webSocketService.getIntentAlerts().subscribe(response => {
      this.notificationsService.showToast(response);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification')));
  }

  getResponses() {
    const project_domain_ids = {project_id: this.projectObjectId, domain_id: this.domainObjectId};
    this.webSocketService.getResponses(project_domain_ids, 'domain_' + this.domainObjectId).subscribe(responses => {
      this.responses_json = responses;
      this.responsesDataSource = new MatTableDataSource(responses);
      this.responsesDataSource.paginator = this.responsesPaginator;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.subscription.add(this.webSocketService.getResponseAlerts().subscribe(response => {
      this.notificationsService.showToast(response);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification')));
  }

  getStories() {
    const project_domain_ids = {project_id: this.projectObjectId, domain_id: this.domainObjectId};
    this.webSocketService.getStories(project_domain_ids, 'domain_' + this.domainObjectId).subscribe(stories => {
      this.stories_json = stories;
      this.storiesDataSource = new MatTableDataSource(stories);
      this.storiesDataSource.paginator = this.storiesPaginator;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.subscription.add(this.webSocketService.getStoryAlerts().subscribe(response => {
      this.notificationsService.showToast(response);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification')));
  }

  addNewIntent() {
    const dialogRef = this.dialog.open(AddIntentComponent, {
      height: '320px',
      width: '345px',
      data: {projectObjectId: this.projectObjectId, domainObjectId: this.domainObjectId}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.createIntent(response, 'domain_' + this.domainObjectId);
      }
    });
  }

  editIntent(intentObjectId: string, intentName: string, intentDescription: string) {
    const dialogRef = this.dialog.open(EditIntentComponent, {
      height: '320px',
      width: '345px',
      data: {
        projectObjectId: this.projectObjectId,
        domainObjectId: this.domainObjectId,
        intentObjectId: intentObjectId,
        intentName: intentName,
        intentDescription: intentDescription
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.editIntent(response, 'domain_' + this.domainObjectId);
      }
    });
  }

  deleteIntent(intentObjectId: string) {
    const dialogRef = this.dialog.open(DeleteIntentComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        const delete_intent_stub = {
          project_id: this.projectObjectId,
          domain_id: this.domainObjectId,
          object_id: intentObjectId
        };
        this.webSocketService.deleteIntent(delete_intent_stub, 'domain_' + this.domainObjectId);
      }
    });
  }

  applyIntentsFilter(filterValue: string) {
    this.intentsDataSource.filter = filterValue.trim().toLowerCase();
  }

  selectIntent(intentObject: any) {
    this.webSocketService.leaveIRSRoom('domain_' + this.domainObjectId);
    this.selectedIRS.emit({irs_object: intentObject, type: 'intent'});
  }

  getIntentsPaginatorData(event: any) {
    localStorage.setItem('intents_pageIndex', event.pageIndex);
    localStorage.setItem('intents_pageSize', event.pageSize);
  }

  addNewResponse() {
    const dialogRef = this.dialog.open(AddResponseComponent, {
      height: '320px',
      width: '345px',
      data: {projectObjectId: this.projectObjectId, domainObjectId: this.domainObjectId}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.createResponse(response, 'domain_' + this.domainObjectId);
      }
    });
  }

  editResponse(responseObjectId: string, responseName: string, responseDescription: string) {
    const dialogRef = this.dialog.open(EditResponseComponent, {
      height: '320px',
      width: '345px',
      data: {
        projectObjectId: this.projectObjectId,
        domainObjectId: this.domainObjectId,
        responseObjectId: responseObjectId,
        responseName: responseName,
        responseDescription: responseDescription
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.editResponse(response, 'domain_' + this.domainObjectId);
      }
    });
  }

  deleteResponse(responseObjectId: string) {
    const dialogRef = this.dialog.open(DeleteResponseComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        const delete_response_stub = {
          project_id: this.projectObjectId,
          domain_id: this.domainObjectId,
          object_id: responseObjectId
        };
        this.webSocketService.deleteResponse(delete_response_stub, 'domain_' + this.domainObjectId);
      }
    });
  }

  applyResponsesFilter(filterValue: string) {
    this.responsesDataSource.filter = filterValue.trim().toLowerCase();
  }

  selectResponse(responseObject: any) {
    this.webSocketService.leaveIRSRoom('domain_' + this.domainObjectId);
    this.selectedIRS.emit({irs_object: responseObject, type: 'response'});
  }

  getResponsesPaginatorData(event: any) {
    localStorage.setItem('responses_pageIndex', event.pageIndex);
    localStorage.setItem('responses_pageSize', event.pageSize);
  }

  addNewStory() {
    const dialogRef = this.dialog.open(AddStoryComponent, {
      height: '320px',
      width: '345px',
      data: {projectObjectId: this.projectObjectId, domainObjectId: this.domainObjectId}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.createStory(response, 'domain_' + this.domainObjectId);
      }
    });
  }

  editStory(storyObjectId: string, storyName: string, storyDescription: string) {
    const dialogRef = this.dialog.open(EditStoryComponent, {
      height: '320px',
      width: '345px',
      data: {
        projectObjectId: this.projectObjectId,
        domainObjectId: this.domainObjectId,
        storyObjectId: storyObjectId,
        storyName: storyName,
        storyDescription: storyDescription
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.editStory(response, 'domain_' + this.domainObjectId);
      }
    });
  }

  deleteStory(storyObjectId: string) {
    const dialogRef = this.dialog.open(DeleteStoryComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        const delete_story_stub = {
          project_id: this.projectObjectId,
          domain_id: this.domainObjectId,
          object_id: storyObjectId
        };
        this.webSocketService.deleteStory(delete_story_stub, 'domain_' + this.domainObjectId);
      }
    });
  }

  applyStoriesFilter(filterValue: string) {
    this.storiesDataSource.filter = filterValue.trim().toLowerCase();
  }

  selectStory(storyObject: any) {
    this.webSocketService.leaveIRSRoom('domain_' + this.domainObjectId);
    this.selectedIRS.emit({irs_object: storyObject, type: 'story'});
  }

  getStoriesPaginatorData(event: any) {
    localStorage.setItem('stories_pageIndex', event.pageIndex);
    localStorage.setItem('stories_pageSize', event.pageSize);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.webSocketService.leaveIRSRoom('domain_' + this.domainObjectId);
    this.dialog.closeAll();
  }
}

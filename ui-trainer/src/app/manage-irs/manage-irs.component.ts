import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
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
import { SharedDataService } from '../common/services/shared-data.service';
import { constant } from '../../environments/constants';
import { environment } from '../../environments/environment';
import { ApiService } from '../common/services/apis.service';

@Component({
  selector: 'app-manage-irs',
  templateUrl: './manage-irs.component.html',
  styleUrls: ['./manage-irs.component.scss']
})
export class ManageIrsComponent implements OnInit, OnDestroy {

  constructor(public notificationsService: NotificationsService,
              public dialog: MatDialog,
              public apiService: ApiService,
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

  ngOnInit() {
    this.intents_json = new Array<object>();
    this.responses_json = new Array<object>();
    this.stories_json = new Array<object>();
    this.activeTabIndex = this.sharedDataService.getSharedData('activeTabIndex', constant.MODULE_COMMON);
    if (this.activeTabIndex === undefined) {
      this.activeTabIndex = '0';
    }
    this.forceIntentReload();
    this.forceResponseReload();
    this.forceStoryReload();
    this.intentsPaginator.pageIndex = +localStorage.getItem('intents_pageIndex');
    this.intentsPaginator.pageSize = +localStorage.getItem('intents_pageSize');
    this.responsesPaginator.pageIndex = +localStorage.getItem('responses_pageIndex');
    this.responsesPaginator.pageSize = +localStorage.getItem('responses_pageSize');
    this.storiesPaginator.pageIndex = +localStorage.getItem('stories_pageIndex');
    this.storiesPaginator.pageSize = +localStorage.getItem('stories_pageSize');
  }

  getIntents() {
    this.apiService.requestIntents(this.projectObjectId, this.domainObjectId).subscribe(intents => {
      if (intents) {
        this.intents_json = intents;
        this.intentsDataSource = new MatTableDataSource(intents);
        this.intentsDataSource.paginator = this.intentsPaginator;
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  getResponses() {
    this.apiService.requestResponses(this.projectObjectId, this.domainObjectId).subscribe(responses => {
      if (responses) {
        this.responses_json = responses;
        this.responsesDataSource = new MatTableDataSource(responses);
        this.responsesDataSource.paginator = this.responsesPaginator;
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  getStories() {
    this.apiService.requestStories(this.projectObjectId, this.domainObjectId).subscribe(stories => {
      if (stories) {
        this.stories_json = stories;
        this.storiesDataSource = new MatTableDataSource(stories);
        this.storiesDataSource.paginator = this.storiesPaginator;
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  addNewIntent() {
    const dialogRef = this.dialog.open(AddIntentComponent, {
      height: '320px',
      width: '345px',
      data: {projectObjectId: this.projectObjectId, domainObjectId: this.domainObjectId}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.apiService.createIntent(response).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceIntentReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
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
        this.apiService.editIntent(response).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceIntentReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
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
        this.apiService.deleteIntent(delete_intent_stub).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceIntentReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
      }
    });
  }

  applyIntentsFilter(filterValue: string) {
    this.intentsDataSource.filter = filterValue.trim().toLowerCase();
  }

  selectIntent(intentObject: any) {
    this.selectedIRS.emit({irs_object: intentObject, type: 'intent'});
  }

  getIntentsPaginatorData(event: any) {
    localStorage.setItem('intents_pageIndex', event.pageIndex);
    localStorage.setItem('intents_pageSize', event.pageSize);
  }

  forceIntentReload() {
    this.apiService.forceIntentsCacheReload('reset');
    this.getIntents();
  }

  addNewResponse() {
    const dialogRef = this.dialog.open(AddResponseComponent, {
      height: '320px',
      width: '345px',
      data: {projectObjectId: this.projectObjectId, domainObjectId: this.domainObjectId}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.apiService.createResponse(response).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceResponseReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
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
        this.apiService.editResponse(response).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceResponseReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
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
        this.apiService.deleteResponse(delete_response_stub).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceResponseReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
      }
    });
  }

  applyResponsesFilter(filterValue: string) {
    this.responsesDataSource.filter = filterValue.trim().toLowerCase();
  }

  selectResponse(responseObject: any) {
    this.selectedIRS.emit({irs_object: responseObject, type: 'response'});
  }

  getResponsesPaginatorData(event: any) {
    localStorage.setItem('responses_pageIndex', event.pageIndex);
    localStorage.setItem('responses_pageSize', event.pageSize);
  }

  forceResponseReload() {
    this.apiService.forceResponsesCacheReload('reset');
    this.getResponses();
  }

  addNewStory() {
    const dialogRef = this.dialog.open(AddStoryComponent, {
      height: '320px',
      width: '345px',
      data: {projectObjectId: this.projectObjectId, domainObjectId: this.domainObjectId}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.apiService.createStory(response).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceStoryReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
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
        this.apiService.editStory(response).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceStoryReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
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
        this.apiService.deleteStory(delete_story_stub).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceStoryReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
      }
    });
  }

  applyStoriesFilter(filterValue: string) {
    this.storiesDataSource.filter = filterValue.trim().toLowerCase();
  }

  selectStory(storyObject: any) {
    this.selectedIRS.emit({irs_object: storyObject, type: 'story'});
  }

  getStoriesPaginatorData(event: any) {
    localStorage.setItem('stories_pageIndex', event.pageIndex);
    localStorage.setItem('stories_pageSize', event.pageSize);
  }

  forceStoryReload() {
    this.apiService.forceStoriesCacheReload('reset');
    this.getStories();
  }

  ngOnDestroy(): void {
    this.apiService.forceIntentsCacheReload('finish');
    this.apiService.forceResponsesCacheReload('finish');
    this.apiService.forceStoriesCacheReload('finish');
    this.dialog.closeAll();
  }
}

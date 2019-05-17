import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
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


@Component({
  selector: 'app-manage-irs',
  templateUrl: './manage-irs.component.html',
  styleUrls: ['./manage-irs.component.scss']
})
export class ManageIrsComponent implements OnInit {

  constructor(public webSocketService: WebSocketService,
              public dialog: MatDialog) { }

  @Input() projectObjectId: string;
  @Input() domainObjectId: string;
  @Output() selectedIRS = new EventEmitter<object>();
  @ViewChild('intentsPaginator', {read: MatPaginator}) intentsPaginator: MatPaginator;
  @ViewChild('responsesPaginator', {read: MatPaginator}) responsesPaginator: MatPaginator;
  @ViewChild('storiesPaginator', {read: MatPaginator}) storiesPaginator: MatPaginator;

  intentsDisplayedColumns: string[] = ['icon', 'intent_name', 'intent_description', 'edit', 'delete'];
  intentsDataSource: any;
  responsesDisplayedColumns: string[] = ['icon', 'response_name', 'response_description', 'edit', 'delete'];
  responsesDataSource: any;
  storiesDisplayedColumns: string[] = ['icon', 'story_name', 'story_description', 'edit', 'delete'];
  storiesDataSource: any;
  show_success_error: boolean;
  success_error_class: string;
  success_error_type: string;
  success_error_message: string;

  ngOnInit() {
    this.webSocketService.createIRSRoom('domain_' + this.domainObjectId);
    this.getIntents();
    this.getResponses();
    this.getStories();
  }

  getIntents() {
    const project_domain_ids = {project_id: this.projectObjectId, domain_id: this.domainObjectId};
    this.webSocketService.getIntents(project_domain_ids, 'domain_' + this.domainObjectId).subscribe(intents => {
      this.intentsDataSource = new MatTableDataSource(intents);
      this.intentsDataSource.paginator = this.intentsPaginator;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.webSocketService.getIntentAlerts().subscribe(response => {
      this.showIRSAlerts(response);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  getResponses() {
    const project_domain_ids = {project_id: this.projectObjectId, domain_id: this.domainObjectId};
    this.webSocketService.getResponses(project_domain_ids, 'domain_' + this.domainObjectId).subscribe(responses => {
      this.responsesDataSource = new MatTableDataSource(responses);
      this.responsesDataSource.paginator = this.responsesPaginator;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.webSocketService.getResponseAlerts().subscribe(response => {
      this.showIRSAlerts(response);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  getStories() {
    const project_domain_ids = {project_id: this.projectObjectId, domain_id: this.domainObjectId};
    this.webSocketService.getStories(project_domain_ids, 'domain_' + this.domainObjectId).subscribe(stories => {
      this.storiesDataSource = new MatTableDataSource(stories);
      this.storiesDataSource.paginator = this.storiesPaginator;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.webSocketService.getStoryAlerts().subscribe(response => {
      this.showIRSAlerts(response);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  addNewIntent() {
    const dialogRef = this.dialog.open(AddIntentComponent, {
      width: '400px',
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
      width: '400px',
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

  selectIntent(intentObjectId: string) {
    this.webSocketService.leaveIRSRoom('domain_' + this.domainObjectId);
    this.selectedIRS.emit({object_id: intentObjectId, type: 'intent'});
  }

  addNewResponse() {
    const dialogRef = this.dialog.open(AddResponseComponent, {
      width: '400px',
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
      width: '400px',
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

  selectResponse(responseObjectId: string) {
    this.webSocketService.leaveIRSRoom('domain_' + this.domainObjectId);
    this.selectedIRS.emit({object_id: responseObjectId, type: 'response'});
  }

  addNewStory() {
    const dialogRef = this.dialog.open(AddStoryComponent, {
      width: '400px',
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
      width: '400px',
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

  showIRSAlerts(res: any) {
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

}

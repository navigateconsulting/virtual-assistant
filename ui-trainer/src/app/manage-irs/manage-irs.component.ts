import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { WebSocketService } from '../common/services/web-socket.service';
import { AddIntentComponent } from '../common/modals/add-intent/add-intent.component';
import { EditIntentComponent } from '../common/modals/edit-intent/edit-intent.component';
import { DeleteIntentComponent } from '../common/modals/delete-intent/delete-intent.component';

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
  @ViewChild(MatPaginator) paginator: MatPaginator;

  intentsDisplayedColumns: string[] = ['icon', 'intent_name', 'intent_description', 'edit', 'delete'];
  intentsDataSource: any;
  responsesDisplayedColumns: string[] = ['icon', 'response_name', 'response_description', 'edit', 'delete'];
  responsesDataSource: any;
  show_success_error: boolean;
  success_error_class: string;
  success_error_type: string;
  success_error_message: string;

  ngOnInit() {
    this.webSocketService.createIRSRoom('domain_' + this.domainObjectId);
    this.getIntents();
    this.getResponses();
  }

  getIntents() {
    const project_domain_ids = {project_id: this.projectObjectId, domain_id: this.domainObjectId};
    this.webSocketService.getIntents(project_domain_ids, 'domain_' + this.domainObjectId).subscribe(intents => {
      this.intentsDataSource = new MatTableDataSource(intents);
      this.intentsDataSource.paginator = this.paginator;
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
      this.responsesDataSource.paginator = this.paginator;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.webSocketService.getResponseAlerts().subscribe(response => {
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

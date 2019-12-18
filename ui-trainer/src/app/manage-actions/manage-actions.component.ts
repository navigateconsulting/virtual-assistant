import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { WebSocketService } from '../common/services/web-socket.service';
import { NotificationsService } from '../common/services/notifications.service';
import { SharedDataService } from '../common/services/shared-data.service';
import { environment } from '../../environments/environment';
import { constant } from '../../environments/constants';
import { MatDialog } from '@angular/material/dialog';
import { AddActionComponent } from '../common/modals/add-action/add-action.component';
import { EditActionComponent } from '../common/modals/edit-action/edit-action.component';
import { DeleteActionComponent } from '../common/modals/delete-action/delete-action.component';

@Component({
  selector: 'app-manage-actions',
  templateUrl: './manage-actions.component.html',
  styleUrls: ['./manage-actions.component.scss']
})
export class ManageActionsComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  constructor(public webSocketService: WebSocketService,
              public notificationsService: NotificationsService,
              public sharedDataService: SharedDataService,
              public dialog: MatDialog) { }

  // tslint:disable-next-line: max-line-length
  actionsDisplayedColumns: string[] = ['icon', 'action_name', 'action_description', 'edit', 'delete'];
  actionsDataSource: any;
  actions_json: Array<object>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.actions_json = new Array<object>();
    this.getActions();
    this.paginator.pageIndex = +localStorage.getItem('actions_pageIndex');
    this.paginator.pageSize = +localStorage.getItem('actions_pageSize');
  }

  getActions() {
    this.webSocketService.createActionsRoom('action');
    this.webSocketService.getActions('action').subscribe(actions => {
      this.actions_json = actions;
      this.actions_json.forEach((action, index) => {
        if (index < 8) {
          action['status'] = true;
        } else {
          action['status'] = false;
        }
      });
      console.log(this.actions_json);
      this.actionsDataSource = new MatTableDataSource(this.actions_json);
      this.actionsDataSource.paginator = this.paginator;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.subscription.add(this.webSocketService.getActionAlerts().subscribe(response => {
      this.notificationsService.showToast(response);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification')));
  }

  addNewAction() {
    const dialogRef = this.dialog.open(AddActionComponent, {
      height: '320px',
      width: '345px',
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        console.log(response);
        this.webSocketService.createAction(response, 'action');
      }
    });
  }

  editAction(actionObjectId: string, actionName: string, actionDescription: string) {
    const dialogRef = this.dialog.open(EditActionComponent, {
      height: '320px',
      width: '345px',
      data: {actionObjectId: actionObjectId, actionName: actionName, actionDescription: actionDescription}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.editAction(response, 'action');
      }
    });
  }

  deleteAction(actionObjectId: string) {
    const dialogRef = this.dialog.open(DeleteActionComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.deleteAction(actionObjectId, 'action');
      }
    });
  }

  applyActionsFilter(filterValue: string) {
    this.actionsDataSource.filter = filterValue.trim().toLowerCase();
  }

  getActionsPaginatorData(event: any) {
    localStorage.setItem('actions_pageIndex', event.pageIndex);
    localStorage.setItem('actions_pageSize', event.pageSize);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.webSocketService.leaveProjectsRoom('action');
    this.dialog.closeAll();
  }

}

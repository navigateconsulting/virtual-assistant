import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { NotificationsService } from '../common/services/notifications.service';
import { SharedDataService } from '../common/services/shared-data.service';
import { MatDialog } from '@angular/material/dialog';
import { AddActionComponent } from '../common/modals/add-action/add-action.component';
import { EditActionComponent } from '../common/modals/edit-action/edit-action.component';
import { DeleteActionComponent } from '../common/modals/delete-action/delete-action.component';
import { ApiService } from '../common/services/apis.service';

@Component({
  selector: 'app-manage-actions',
  templateUrl: './manage-actions.component.html',
  styleUrls: ['./manage-actions.component.scss']
})
export class ManageActionsComponent implements OnInit, OnDestroy {

  constructor(public apiService: ApiService,
              public notificationsService: NotificationsService,
              public sharedDataService: SharedDataService,
              public dialog: MatDialog) { }

  // tslint:disable-next-line: max-line-length
  actionsDisplayedColumns: string[] = ['icon', 'action_name', 'action_description', 'edit', 'delete'];
  actionsDataSource: any;
  actions_json: Array<object>;
  filterActionText: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    sessionStorage.setItem('currentPage', 'actions');
    this.actions_json = new Array<object>();
    this.getActions();
    this.paginator.pageIndex = +localStorage.getItem('actions_pageIndex');
    this.paginator.pageSize = +localStorage.getItem('actions_pageSize');
  }

  getActions() {
    this.apiService.requestActions().subscribe(actions => {
      if (actions) {
        this.actions_json = actions;
        this.actions_json.forEach((action, index) => {
          if (index < 8) {
            action['status'] = true;
          } else {
            action['status'] = false;
          }
        });
        this.actionsDataSource = new MatTableDataSource(this.actions_json);
        this.actionsDataSource.paginator = this.paginator;
        this.applyActionsFilter(this.filterActionText);
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  addNewAction() {
    const dialogRef = this.dialog.open(AddActionComponent, {
      height: '320px',
      width: '345px',
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.apiService.createAction(response).subscribe(result => {
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

  editAction(actionObjectId: string, actionName: string, actionDescription: string) {
    const dialogRef = this.dialog.open(EditActionComponent, {
      height: '320px',
      width: '345px',
      data: {actionObjectId: actionObjectId, actionName: actionName, actionDescription: actionDescription}
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.apiService.editAction(response).subscribe(result => {
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

  deleteAction(actionObjectId: string) {
    const dialogRef = this.dialog.open(DeleteActionComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.apiService.deleteAction(actionObjectId).subscribe(result => {
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

  forceReload() {
    this.apiService.forceActionsCacheReload('reset');
    this.getActions();
  }

  applyActionsFilter(filterValue: string) {
    this.actionsDataSource.filter = filterValue.trim().toLowerCase();
  }

  getActionsPaginatorData(event: any) {
    localStorage.setItem('actions_pageIndex', event.pageIndex);
    localStorage.setItem('actions_pageSize', event.pageSize);
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('currentPage');
    this.apiService.forceActionsCacheReload('finish');
    this.dialog.closeAll();
  }

}

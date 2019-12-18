import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HeaderService } from '../services/header.service';
import { WebSocketService } from '../../common/services/web-socket.service';
import { NotificationsService } from '../../common/services/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmRefreshComponent } from '../modals/confirm-refresh/confirm-refresh.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showTrainerOrDeploy: string;

  constructor(public dialog: MatDialog,
              private headerService: HeaderService,
              private webSocketService: WebSocketService,
              public notificationsService: NotificationsService) { }

  ngOnInit() {
    this.showTrainerOrDeploy = 'both';
    this.headerService.invokeEvent.subscribe(value => {
      if (value) {
        this.showTrainerOrDeploy = value;
      } else {
        this.showTrainerOrDeploy = 'both';
      }
    });
  }

  refreshDB() {
    const dialogRef = this.dialog.open(ConfirmRefreshComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.webSocketService.refreshAppDB().subscribe((resp: any) => {
        },
        err => console.error('Observer got an error: ' + err),
        () => {console.log('Observer got a complete notification')});
      }
      window.location.reload();
    });
  }
}

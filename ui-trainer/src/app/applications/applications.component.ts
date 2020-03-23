import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../common/services/web-socket.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmRefreshComponent } from '../common/modals/confirm-refresh/confirm-refresh.component';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  constructor(public dialog: MatDialog,
              private webSocketService: WebSocketService) { }

  ngOnInit() {
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

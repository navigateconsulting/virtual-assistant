import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../common/services/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmRefreshComponent } from '../common/modals/confirm-refresh/confirm-refresh.component';
import { ApiService } from '../common/services/apis.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  constructor(public dialog: MatDialog,
              public apiService: ApiService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationsService: NotificationsService) { }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('app') !== null && this.route.snapshot.paramMap.get('app') !== 'refresh') {
      this.router.navigate(['home/' + this.route.snapshot.paramMap.get('app')]);
    } else if (this.route.snapshot.paramMap.get('app') === 'refresh') {
      this.refreshDB();
    }
  }

  refreshDB() {
    const dialogRef = this.dialog.open(ConfirmRefreshComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.apiService.refreshAppDB().subscribe(result => {
          if(result) {
            this.notificationsService.showToast(result);
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => {console.log('Observer got a complete notification')});
      }
    });
  }

}

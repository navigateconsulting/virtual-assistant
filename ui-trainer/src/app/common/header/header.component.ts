import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../common/services/apis.service';
import { NotificationsService } from '../../common/services/notifications.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showTrainerOrDeploy: string;

  constructor(public dialog: MatDialog,
              public apiService: ApiService,
              public notificationsService: NotificationsService) { }

  ngOnInit() {}

  closeWindow() {
    window.close();
  }
}

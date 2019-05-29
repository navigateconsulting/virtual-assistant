import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../common/services/web-socket.service';
import { SharedDataService } from '../common/services/shared-data.service';
import { constant } from '../../environments/constants';

@Component({
  selector: 'app-try-now',
  templateUrl: './try-now.component.html',
  styleUrls: ['./try-now.component.scss']
})
export class TryNowComponent implements OnInit, OnDestroy {

  projectObjectId: string;
  showSpinner: boolean;

  constructor(private route: ActivatedRoute,
              public webSocketService: WebSocketService,
              public sharedDataService: SharedDataService) { }

  ngOnInit() {
    this.projectObjectId = this.sharedDataService.getSharedData('projectObjectId', constant.MODULE_COMMON);
    this.showSpinner = false;
    // this.tryNowProject();
  }

  tryNowProject() {
    this.webSocketService.createTryNowRoom('try_now');
    this.webSocketService.tryNowProject(this.projectObjectId, 'try_now').subscribe(response => {
      this.showSpinner = false;
      console.log(response);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  ngOnDestroy(): void {
    window.location.reload();
  }

}

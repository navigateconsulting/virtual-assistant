import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../common/services/web-socket.service';
import { SharedDataService } from '../common/services/shared-data.service';
import { constant } from '../../environments/constants';
import { Chats } from '../common/models/chats';

@Component({
  selector: 'app-try-now',
  templateUrl: './try-now.component.html',
  styleUrls: ['./try-now.component.scss']
})
export class TryNowComponent implements OnInit, OnDestroy {

  projectObjectId: string;
  showSpinner: boolean;
  chats: Chats[];
  userChatMessage: string;
  showBotTyping: boolean;

  constructor(public webSocketService: WebSocketService,
              public sharedDataService: SharedDataService) { }

  ngOnInit() {
    this.projectObjectId = this.sharedDataService.getSharedData('projectObjectId', constant.MODULE_COMMON);
    this.showSpinner = true;
    this.showBotTyping = false;
    this.tryNowProject();
  }

  tryNowProject() {
    this.webSocketService.createTryNowRoom('try_now');
    this.webSocketService.tryNowProject(this.projectObjectId).subscribe(response => {
      if (response.status === 'Success') {
        this.showSpinner = false;
        this.chats = new Array<Chats>();
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  sendChat() {
    this.chats.push({text: this.userChatMessage, type: 'user'});
    this.showBotTyping = true;
    this.webSocketService.chatNowProject(this.userChatMessage).subscribe(response => {
      if (response) {
        this.showBotTyping = false;
        this.chats.push({text: response.text, type: 'bot'});
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
    this.userChatMessage = '';
  }

  ngOnDestroy(): void {
    window.location.reload();
  }

}

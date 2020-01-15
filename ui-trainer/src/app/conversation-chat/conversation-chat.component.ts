import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../common/services/shared-data.service';
import { Router } from '@angular/router';
import { constant } from '../../environments/constants';

@Component({
  selector: 'app-conversation-chat',
  templateUrl: './conversation-chat.component.html',
  styleUrls: ['./conversation-chat.component.scss']
})
export class ConversationChatComponent implements OnInit {

  conversation_id: string;
  chats: Array<object>;
  conversation_json: Array<object>;

  constructor(public sharedDataService: SharedDataService,
              public _router: Router) { }

  ngOnInit() {
    this.conversation_id = this.sharedDataService.getSharedData('conversation_id', constant.MODULE_COMMON);
    if (Object.keys(this.conversation_id).length === 0) {
      this._router.navigate(['/home/conversations']);
    } else {
      this.conversation_json = new Array<object>();
      this.conversation_json = this.sharedDataService.getSharedData('conversation_json', constant.MODULE_COMMON)[0];
      delete this.conversation_json['_id'];
      delete this.conversation_json['sender_id'];
      this.getConversationChat();
    }
  }

  getConversationChat() {
    this.chats = new Array<object>();
    this.chats = this.conversation_json['events'];
  }

}

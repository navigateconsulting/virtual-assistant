import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../common/services/shared-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { constant } from '../../environments/constants';
import { ApiService } from '../common/services/apis.service';

declare var changeRowBackgroundColor: Function;

@Component({
  selector: 'app-conversation-chat',
  templateUrl: './conversation-chat.component.html',
  styleUrls: ['./conversation-chat.component.scss']
})
export class ConversationChatComponent implements OnInit {

  conversation_id: string;
  chats: Array<object>;
  chats_backup: Array<object>;
  conversation_json: any;
  showUserBotCardDetails: boolean;
  showUserPredictionsDetails: boolean;
  storyCode: any;
  predictions: any;
  userBotCardType: string;
  userBotCardText: string;
  userBotCardTime;
  userBotCardIntent: string;
  userBotCardConfidence: string;
  showAllIntentEntities = true;
  showIntentEntitiesData: [];

  constructor(public sharedDataService: SharedDataService,
              public _router: Router,
              public route: ActivatedRoute,
              public apiService: ApiService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.conversation_id = params.get('conversation_id');
      if (Object.keys(this.conversation_id).length === 0) {
        this._router.navigate(['/home/conversations']);
      } else {
        this.showUserBotCardDetails = false;
        this.showUserPredictionsDetails = true;
        this.conversation_json = this.sharedDataService.getSharedData('conversation_json', constant.MODULE_COMMON)[0];
        if (this.conversation_json !== undefined) {
          delete this.conversation_json['_id'];
          delete this.conversation_json['sender_id'];
          this.getConversationChat();
        } else {
          this.apiService.requestConversationChats(this.conversation_id).subscribe(chats => {
            if (chats) {
              this.conversation_json = chats;
              this.getConversationChat();
            }
          },
          err => console.error('Observer got an error: ' + err),
          () => console.log('Observer got a complete notification'));
        }
      }
    });
  }

  getConversationChat() {
    if (this.conversation_json) {
      this.chats = this.chats_backup = new Array<object>();
      this.chats = this.chats_backup = this.storyCode = this.conversation_json['events'];
    }
  }

  selectRowIndex(chat_row_index: number) {
    changeRowBackgroundColor(chat_row_index);
    if (this.chats[chat_row_index]['event'] === 'user') {
      this.userBotCardType = 'M';
      this.userBotCardText = this.chats[chat_row_index]['text'];
      this.userBotCardTime = new Date(Math.floor(this.chats[chat_row_index]['timestamp']) * 1000);
      this.userBotCardIntent = this.chats[chat_row_index]['parse_data']['intent']['name'];
      this.userBotCardConfidence = this.chats[chat_row_index]['parse_data']['intent']['confidence'];
      if (this.chats[chat_row_index]['parse_data']['entities'].length >= 1) {
        this.showIntentEntitiesData = this.chats[chat_row_index]['parse_data']['entities']
      } else {
        this.showIntentEntitiesData = [];
      }
      this.showAllIntentEntities = false;
      // tslint:disable-next-line: max-line-length
      this.predictions = { text: this.chats[chat_row_index]['parse_data']['text'], intent_ranking: this.chats[chat_row_index]['parse_data']['intent_ranking'] };
      this.showUserBotCardDetails = true;
      this.showUserPredictionsDetails = true;
    } else if (this.chats[chat_row_index]['event'] === 'bot') {
      this.userBotCardType = 'B';
      this.userBotCardText = this.chats[chat_row_index]['text'];
      this.userBotCardTime = new Date(Math.floor(this.chats[chat_row_index]['timestamp']) * 1000);
      this.userBotCardIntent = '';
      this.userBotCardConfidence = '';
      this.predictions = { text: '', intent_ranking: '' };
      this.showUserBotCardDetails = true;
      this.showUserPredictionsDetails = false;
    } else if (this.chats[chat_row_index]['event'] === 'action') {
      this.predictions = { text: '', intent_ranking: '' };
      this.showUserBotCardDetails = false;
      this.showUserPredictionsDetails = false;
    }
    this.storyCode = this.chats_backup.slice(0, chat_row_index + 1);
  }

}

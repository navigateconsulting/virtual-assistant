import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { WebSocketService } from '../common/services/web-socket.service';
import { NotificationsService } from '../common/services/notifications.service';
import { SharedDataService } from '../common/services/shared-data.service';
import { constant } from '../../environments/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  constructor(public webSocketService: WebSocketService,
              public notificationsService: NotificationsService,
              public sharedDataService: SharedDataService,
              public _router: Router) { }

  // tslint:disable-next-line: max-line-length
  conversationsDisplayedColumns: string[] = ['conversation_id', 'conversation_timestamp', 'icon'];
  conversationsDataSource: any;
  conversations_json: Array<object>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.conversations_json = new Array<object>();
    this.getConversations();
    this.paginator.pageIndex = +localStorage.getItem('conversations_pageIndex');
    this.paginator.pageSize = +localStorage.getItem('conversations_pageSize');
  }

  getConversations() {
    this.webSocketService.createConversationsRoom('conversation');
    this.webSocketService.getConversations('conversation').subscribe(conversations => {
      this.conversations_json = conversations;
      this.conversationsDataSource = new MatTableDataSource(this.conversations_json);
      this.conversationsDataSource.paginator = this.paginator;
    },
      err => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification'));
  }

  applyConversationsFilter(filterValue: string) {
    this.conversationsDataSource.filter = filterValue.trim().toLowerCase();
  }

  getConversationsPaginatorData(event: any) {
    localStorage.setItem('conversations_pageIndex', event.pageIndex);
    localStorage.setItem('conversations_pageSize', event.pageSize);
  }

  openConversationChat(conversation_id: string) {
    this.sharedDataService.setSharedData('conversation_id', conversation_id, constant.MODULE_COMMON);
    // tslint:disable-next-line: max-line-length
    this.sharedDataService.setSharedData('conversation_json', this.conversations_json.filter(conversations => conversations['sender_id'] === conversation_id), constant.MODULE_COMMON);
    this._router.navigate(['/home/conversation-chat']);
  }

  convertTimestamp(time_stamp) {
    return new Date(time_stamp * 1000).toLocaleString();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.webSocketService.leaveConversationsRoom('conversation');
  }

}

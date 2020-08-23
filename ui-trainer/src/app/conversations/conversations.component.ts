import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { NotificationsService } from '../common/services/notifications.service';
import { SharedDataService } from '../common/services/shared-data.service';
import { constant } from '../../environments/constants';
import { Router } from '@angular/router';
import { ApiService } from '../common/services/apis.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit, OnDestroy {

  constructor(public apiService: ApiService,
    public notificationsService: NotificationsService,
    public sharedDataService: SharedDataService,
    public _router: Router) { }

  // tslint:disable-next-line: max-line-length
  conversationsDisplayedColumns: string[] = ['conversation_id', 'conversation_timestamp', 'icon'];
  conversationsDataSource: any;
  conversations_json: Array<object>;
  conversations_json_backup: Array<object>;
  filterConversationText = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.conversations_json = new Array<object>();
    this.conversations_json_backup = new Array<object>();
    this.getConversations();
    this.paginator.pageIndex = +localStorage.getItem('conversations_pageIndex');
    this.paginator.pageSize = +localStorage.getItem('conversations_pageSize');
  }

  getConversations() {
    this.apiService.requestConversations().subscribe(conversations => {
      if (conversations) {
        this.conversations_json = conversations.sort(function (a, b) {
          var x = a['latest_event_time']; var y = b['latest_event_time'];
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
        this.conversations_json_backup = JSON.parse(JSON.stringify(this.conversations_json));
        this.conversationsDataSource = new MatTableDataSource(this.conversations_json);
        this.conversationsDataSource.paginator = this.paginator;
        this.applyConversationsFilter(this.filterConversationText);
      }
    },
      err => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification'));
  }

  applyConversationsFilter(filterValue: string) {
    this.conversations_json = this.conversations_json_backup;
    this.conversations_json = this.conversations_json.filter((value) => {
      const converted_ts = this.convertTimestamp(value['latest_event_time']);
      // tslint:disable-next-line: max-line-length
      if (value['sender_id'].includes(filterValue.trim()) ||
        value['sender_id'].toLowerCase().includes(filterValue.trim()) ||
        value['sender_id'].toUpperCase().includes(filterValue.trim()) ||
        converted_ts.includes(filterValue.trim()) ||
        converted_ts.includes(filterValue.trim()) ||
        converted_ts.includes(filterValue.trim())) {
        return value;
      }
    });
    this.conversationsDataSource = new MatTableDataSource(this.conversations_json);
  }

  getConversationsPaginatorData(event: any) {
    localStorage.setItem('conversations_pageIndex', event.pageIndex);
    localStorage.setItem('conversations_pageSize', event.pageSize);
  }

  openConversationChat(conversation_id: string) {
    // tslint:disable-next-line: max-line-length
    this.sharedDataService.setSharedData('conversation_json', this.conversations_json_backup.filter(conversations => conversations['sender_id'] === conversation_id), constant.MODULE_COMMON);
    this._router.navigate(['/home/conversations/' + conversation_id]);
  }

  convertTimestamp(time_stamp) {
    return new Date(time_stamp * 1000).toLocaleString();
  }

  ngOnDestroy(): void {
    this.apiService.forceConversationsCacheReload();
  }

}

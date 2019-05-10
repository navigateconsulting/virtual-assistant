import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../common/services/chat.service';

@Component({
  selector: 'app-socket-io',
  templateUrl: './socket-io.component.html',
  styleUrls: ['./socket-io.component.scss']
})
export class SocketIoComponent implements OnInit, OnDestroy {

  messages = [];
  connection: any;
  message: string;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.connection = this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  ngOnDestroy(): void {
    this.connection.unsubscribe();
  }

}

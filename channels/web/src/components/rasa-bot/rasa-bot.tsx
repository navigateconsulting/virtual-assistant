import { Component, Prop, h } from '@stencil/core';
import { uuidv4, wait } from '../../utils/utils.js';
import '@assister/chat/';
import { IncomingEventDetail } from '@assister/chat/dist/types/interfaces';

function mapDuration(gap) {
  return {
    'none': 0,
    'short': 500,
    'long': 1000
  }[gap]
}

let previousMessageSent = Promise.resolve();

@Component({
  tag: 'rasa-bot',
  styleUrl: 'rasa-bot.css',
  shadow: true
})
export class RasaBot {
  /**
   * Rasa server address
   */
  @Prop({reflectToAttr: true}) server: string;
  @Prop({reflectToAttr: true}) conversation: string = uuidv4();
  @Prop({reflectToAttr: true}) header: string = 'Virtual Assistant';
  @Prop({reflectToAttr: true}) gap: 'none' | 'short' | 'long' = 'long';
  private pane?: HTMLChatPaneElement;
  private fab?: HTMLFabAppElement;

  handleIncomingMessage(event: CustomEvent<IncomingEventDetail>) {
    const chatMessageElement = event.detail.element;
    fetch(`${this.server}/conversations/${this.conversation}/messages`, {
      method: 'POST',
      body: JSON.stringify({text: event.detail.text, sender: 'user'}),
      headers:{
        'Content-Type': 'application/json'
      }
    })
      .then(() => chatMessageElement.state = 'delivered')
      .then(() => this.predictUntilListen())
      .then(wait(mapDuration(this.gap)))
      .then(() => chatMessageElement.state = 'read')
  }

  predictUntilListen(execution?) {
    if (execution && execution.messages && execution.messages.length == 0) {
      return;
    } else if (execution) {
      execution.messages.map(message => {
        previousMessageSent = previousMessageSent
          .then(wait(mapDuration(this.gap)))
          .then(() => {
            if (message.text) {
              this.pane.addIncomingMessage(message.text);
            }
            if (message.image) {
              this.pane.addCard({image: message.image});
            }
          });
      });
    }
    fetch(`${this.server}/conversations/${this.conversation}/predict`, {method: 'POST'})
    .then(result => result.json())
    .then(response => response.scores[0].action)
    .then(action => fetch(`${this.server}/conversations/${this.conversation}/execute`, {
      method: 'POST',
      body: JSON.stringify({name: action}),
      headers:{
        'Content-Type': 'application/json'
      }
    }))
    .then(result => result.json())
    .then(execution => this.predictUntilListen(execution))
  }

  componentDidLoad() {
    this.predictUntilListen();
  }

  render() {
    return (
      <fab-app ref={element => this.fab = element}>
        <chat-pane class="trainer-chat-pane" ref={element => this.pane = element} onIncoming={event => this.handleIncomingMessage(event)}>
          <ion-toolbar slot="header" class="toolbar">
            <ion-title>
              <div class="trainer-icon-div">
                <ion-icon class="trainer-icon" src="../assets/images/trainer.svg"></ion-icon>
              </div>
              <div class="trainer-header-div">
                <span class="trainer-header"><b>{this.header}</b></span>
              </div>
            </ion-title>
            <ion-buttons slot="primary">
              <ion-button onClick={() => this.fab.close()}>
                <ion-icon slot="icon-only" name="close" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </chat-pane>
      </fab-app>
    );
  }
}

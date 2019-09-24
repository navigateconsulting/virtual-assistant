export type MessageDirection = 'incoming' | 'outgoing';

export type MessageState = 'none' | 'pending' | 'delivered' | 'read';

export type MessageTriangle = 'none' | 'top' | 'bottom';

export interface AssisterInputChangeEventDetail {
  value: string;
}

export interface IncomingEventDetail {
  text: string,
  element: HTMLChatMessageElement
}

# rasa-bot



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute      | Description         | Type                          | Default       |
| -------------- | -------------- | ------------------- | ----------------------------- | ------------- |
| `conversation` | `conversation` |                     | `string`                      | `uuidv4()`    |
| `gap`          | `gap`          |                     | `"long" \| "none" \| "short"` | `'long'`      |
| `header`       | `header`       |                     | `string`                      | `'Assistant'` |
| `server`       | `server`       | Rasa server address | `string`                      | `undefined`   |


## Dependencies

### Depends on

- fab-app
- chat-pane
- ion-toolbar
- ion-title
- ion-buttons
- ion-button
- ion-icon

### Graph
```mermaid
graph TD;
  rasa-bot --> fab-app
  rasa-bot --> chat-pane
  rasa-bot --> ion-toolbar
  rasa-bot --> ion-title
  rasa-bot --> ion-buttons
  rasa-bot --> ion-button
  rasa-bot --> ion-icon
  fab-app --> ion-fab-button
  fab-app --> ion-icon
  ion-fab-button --> ion-icon
  ion-fab-button --> ion-ripple-effect
  chat-pane --> chat-message
  chat-pane --> ion-card
  chat-pane --> ion-card-content
  chat-pane --> ion-header
  chat-pane --> chat-conversation
  chat-pane --> ion-footer
  chat-pane --> chat-input
  chat-message --> ion-item
  chat-message --> chat-message-status
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  chat-message-status --> ion-icon
  chat-message-status --> chat-check-mark
  ion-card --> ion-ripple-effect
  chat-conversation --> ion-content
  chat-conversation --> ion-list
  chat-input --> ion-icon
  chat-input --> ion-item
  chat-input --> ion-textarea
  ion-button --> ion-ripple-effect
  style rasa-bot fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

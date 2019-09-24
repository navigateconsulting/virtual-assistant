[![npm version](https://badge.fury.io/js/%40assister%2Fchat.svg)](https://www.npmjs.com/package/@assister/chat)
[![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)](https://stenciljs.com/)

# Assister Chat

Chatbot and live chat Web Components

![Demo Gif](https://i.imgur.com/gt0TjLS.gif)

[Live Demo](https://assister.ai/chat/)

## Install

### Unpkg

```html
<script type="module" src="https://unpkg.com/@assister/chat@latest/dist/chat/chat.esm.js"></script>
<script nomodule src="https://unpkg.com/@assister/chat@latest/dist/chat/chat.js"></script>
<link href="https://unpkg.com/@assister/chat@latest/dist/chat/chat.css" rel="stylesheet">
```

### NPM

```sh
npm install @assister/chat --save
```

## Components

### All-in-one

- [chat-pane](https://github.com/assister-ai/assister/tree/master/packages/chat/src/components/pane)

### View only

- [chat-message](https://github.com/assister-ai/assister/tree/master/packages/chat/src/components/message)
- [chat-input](https://github.com/assister-ai/assister/tree/master/packages/chat/src/components/input)
- [chat-conversation](https://github.com/assister-ai/assister/tree/master/packages/chat/src/components/conversation)
- [fab-app](https://github.com/assister-ai/assister/tree/master/packages/chat/src/components/fab)

## Usage

```html
<!doctype html>
<html lang="en">
  <head>
    <script type="module" src="https://unpkg.com/@assister/chat@latest/dist/chat/chat.esm.js"></script>
    <link href="https://unpkg.com/@assister/chat@latest/dist/chat/chat.css" rel="stylesheet">
    <style>
      :root {
        /* --message-incoming-color: yellow; */
      }
    </style>
    <script>
      const responses = [
        'Interesting!',
        'Yeah, I thought so too.',
        `That'd be really cool, though I'm not sure what my schedule is...

        I'll let you know.`,
        'You think so?',
        'Great!',
        'Ah sh**!',
        "Well, that's new!",
        'Alright',
        'OK'
      ];
      function randomResponse() {
        const index = Math.floor(Math.random() * responses.length);
        return responses[index];
      }
      const wait = () => new Promise(resolve => setTimeout(resolve, 500));
      window.onload = () => {
        const fab = document.getElementById('fab');
        document.getElementById('close').addEventListener('click', () => fab.close());
        const pane = document.getElementById('pane');
        function handleIncomingMessage(event) {
          const message = event.detail;
          wait()
            .then(() => message.state = 'delivered')
            .then(wait)
            .then(() => message.state = 'read')
            .then(wait)
            .then(() => pane.addIncomingMessage(randomResponse()));
        }
        pane.addEventListener('incoming', handleIncomingMessage);
      }
    </script>
  </head>
  <body>
    <ion-app>      
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item style="height: 3000px">
              I'm here for scroll!
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-app>

    <fab-app id="fab">
      <chat-pane id="pane">
          <ion-toolbar slot="header" color="primary">
            <ion-title>Assister Chat</ion-title>
            <ion-buttons slot="primary">
              <ion-button id="close">
                <ion-icon slot="icon-only" name="close" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
          <ion-card style="background: white;">
            <ion-card-content>
            <p>Chat with this <i>Simple-Bot</i>!</p>
            <p>It knows only a few responses...</p>
            </ion-card-content>
          </ion-card>
          <chat-message state="read" footer="10:00 AM">
            <p>yess!!</p>
          </chat-message>
          <chat-message direction="incoming">
            <h2>Welcome to Assister Chat!</h2>
            <p>This is a demo for <b>chat-pane</b> web component.</p>
            <br />
            <p>
              <b>chat-pane</b> is an <i>"all-in-one"</i> element that
              encapsulates other chat elements, designed for simple
              use cases.
            </p>
            <h2>Use with other libraries?</h2>
            <p>That's exactly the purpose of our design!</p>
            <br />
            <p>
              However, you might want to use our <i>"view components"</i> so
              that you have fine-grained control over things that render
              inside <b>DOM</b>.
            </p>
          </chat-message>
          <chat-message state="pending"  footer="Hello! I'm little-footer!">
            <p>This is a <b>chat-message</b>!</p>
            <p>It has <i>"footer"</i> and <i>"state"</i> attributes.</p>              
          </chat-message>
          <chat-message state="delivered" footer="10:01 AM">
            <p>This one is <i>"delivered"</i>!</p>
          </chat-message>
          <chat-message state="read" footer="10:01 AM">
            <p><i>"read"</i>!</p>
          </chat-message>
          <chat-message direction="incoming" footer="10:02 AM">
            <p>Your turn!</p>
          </chat-message>
      </chat-pane>
    </fab-app>
  </body>
</html>
```

## Resources

[CSS variables](https://github.com/assister-ai/assister/blob/master/packages/chat/src/global/app.css#L33)

[StencilJS](https://stenciljs.com/docs/decorators)

[Ionic 4](https://ionicframework.com/docs/components)

## License

[MIT](https://github.com/assister-ai/assister/blob/master/LICENSE)

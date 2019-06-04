from aiohttp import web
import socketio
from config import CONFIG


if CONFIG.get('backend-trainer', 'LOGGING') == 'TRUE':
    print("--------------------Starting Socketio Connection in Debug Mode --------------------------")
    sio = socketio.AsyncServer(logger=True, engineio_logger=True)
else:
    sio = socketio.AsyncServer(logger=False, engineio_logger=False)

app = web.Application()
sio.attach(app)


async def index(request):
    print(request)
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')


# Imports for Endpoints

import endpoints
import rooms_endpoints

app.router.add_get('/', index)

# We kick off our server
if __name__ == '__main__':
    sio.attach(app)
    web.run_app(app, port=CONFIG.get('backend-trainer', 'PORT'))

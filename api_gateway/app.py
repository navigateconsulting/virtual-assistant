from aiohttp import web
import socketio
from config import CONFIG


if CONFIG.get('api_gateway', 'LOGGING') == 'TRUE':
    print("--------------------Starting Socketio Connection in Debug Mode --------------------------")
    sio = socketio.AsyncServer(async_mode='aiohttp', logger=True, engineio_logger=True, ping_timeout=60000000, ping_interval=6000000 )
else:
    sio = socketio.AsyncServer(async_mode='aiohttp', logger=False, engineio_logger=False, ping_timeout=60000000, ping_interval= 6000000)

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
    web.run_app(app, port=CONFIG.get('api_gateway', 'PORT'))

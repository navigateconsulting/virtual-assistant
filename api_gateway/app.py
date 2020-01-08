from aiohttp import web
import socketio
from config import CONFIG
import aiohttp_cors
import json

if CONFIG.get('api_gateway', 'LOGGING') == 'TRUE':
    print("--------------------Starting Socketio Connection in Debug Mode --------------------------")
    sio = socketio.AsyncServer(async_mode='aiohttp', logger=True, engineio_logger=True, ping_timeout=60000000, ping_interval=6000000 )
else:
    sio = socketio.AsyncServer(async_mode='aiohttp', logger=False, engineio_logger=False, ping_timeout=60000000, ping_interval= 6000000)

app = web.Application()
sio.attach(app)
cors = aiohttp_cors.setup(app)

async def index(request):
    print(request)
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

# Imports for Endpoints

import endpoints
import rooms_endpoints

try_chat_now = endpoints.TryNow()

async def trynow(request):
    return await try_chat_now.on_trynow(request)

async def chatnow(request):
    return await try_chat_now.on_chatNow(request)

app.router.add_get('/', index)
cors.add(app.router.add_route("POST", "/tryNow", trynow), {
    "*": aiohttp_cors.ResourceOptions(
        allow_credentials=True,
        expose_headers=("X-Custom-Server-Header",),
        allow_headers=("X-Requested-With", "Content-Type"),
        max_age=3600,
    )
})
cors.add(app.router.add_route("POST", "/chatNow", chatnow), {
    "*": aiohttp_cors.ResourceOptions(
        allow_credentials=True,
        expose_headers=("X-Custom-Server-Header",),
        allow_headers=("X-Requested-With", "Content-Type"),
        max_age=3600,
    )
})

# We kick off our server
if __name__ == '__main__':
    sio.attach(app)
    web.run_app(app, port=CONFIG.get('api_gateway', 'PORT'))

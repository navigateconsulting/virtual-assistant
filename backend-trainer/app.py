from aiohttp import web
import socketio
from models import dbname, projectsModel

# creates a new Async Socket IO Server

sio = socketio.AsyncServer()

# Creates a new Aiohttp Web Application

app = web.Application()

# Binds our Socket.IO server to our Web App
# instance

sio.attach(app)

# we can define aiohttp endpoints just as we normally
# would with no change


async def index(request):
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

# Connect Disconnect events


@sio.on('connect')
def connect(sid, environ):
    print('connect ', sid)


@sio.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)


# projects Endpoints


@sio.on('getProjects', namespace='/project')
async def getProjects(sid):
    result= await projectsModel.getProjects()
    print("Got result {} from session {}".format(result, sid))
    await sio.emit('allProjects', result, namespace='/project')


@sio.on('createProject', namespace='/project')
async def createProjects(sid, record):

    record_id= await projectsModel.createProjects(record)
    await sio.emit('projectResponse', {"message": "Project created with ID {} ".format(record_id)}, namespace='/project', room=sid)

    result = await projectsModel.getProjects()
    await sio.emit('allProjects', result, namespace='/project')


@sio.on('deleteProject', namespace='/project')
async def deleteProject(sid, object_id):

    record_id = await projectsModel.deleteProject(object_id)
    await sio.emit('projectsResponse', {'message': 'project Deleted with id {}'.format(record_id)}, namespace='/project', room=sid)

    result = await projectsModel.getProjects()
    await sio.emit('allProjects', result, namespace='/project')


@sio.on('updateProject', namespace='/project')
async def updateProject(sid, update_query):

    update_query = {"object_id": "123", "project_id": "123", "project_name": "project_name", "project_description" : "project description"}

    result = await projectsModel.updateProject(update_query)
    await sio.emit('projectsResponse', {"message": "Updated project with row {}".format(result)}, namespace='/project', room=sid)

    result = await projectsModel.getProjects()
    await sio.emit('allProjects', result, namespace='/project')



# Domains Endpoints


@sio.on('getDomain', namespace='/domain')
async def get_projects(sid):
    print(sid)
    print("Got request on Get domain Resource")
    await sio.emit('domainResponse', {'message': 'domain Details'})


@sio.on('createDomain', namespace='/domain')
async def get_projects(sid):
    print(sid)
    print("Got request on create domian Resource")
    await sio.emit('domainResponse', {'message': 'domain ID created'})


@sio.on('deleteDomain', namespace='/domain')
async def get_projects(sid):
    print(sid)
    print("Got request on Delete domain Resource")
    await sio.emit('domainResponse', {'message': 'domain Deleted '})


# We bind our aiohttp endpoint to our app


app.router.add_get('/', index)

# We kick off our server
if __name__ == '__main__':
    web.run_app(app, port=8089)
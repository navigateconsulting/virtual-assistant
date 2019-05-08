from aiohttp import web
import socketio
from models import dbname, projectsModel, domainsModel

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


# Rooms Hooks

@sio.on('join_room')
async def join_room(sid, room_name):
    print(" User {} joined room {}".format(sid,room_name))
    sio.enter_room(sid, room_name)


@sio.on('leave_room')
async def leave_room(sid, room_name):
    print(" User {} left room {}".format(sid, room_name))
    sio.leave_room(sid, room_name)


# projects Endpoints


@sio.on('getProjects', namespace='/project')
async def getProjects(sid):

    print("---------- Request from Session {} -------------- ".format(sid))

    result = await projectsModel.getProjects()
    await sio.emit('allProjects', result, namespace='/project')


@sio.on('createProject', namespace='/project')
async def createProjects(sid, record):

    print("---------- Request from Session {} -------------- ".format(sid))

    record_id= await projectsModel.createProjects(record)
    await sio.emit('projectResponse', {"message": "Project created with ID {} ".format(record_id)}, namespace='/project', room=sid)

    result = await projectsModel.getProjects()
    await sio.emit('allProjects', result, namespace='/project')


@sio.on('deleteProject', namespace='/project')
async def deleteProject(sid, object_id):

    print("---------- Request from Session {} -------------- ".format(sid))

    record_id = await projectsModel.deleteProject(object_id)
    await sio.emit('projectsResponse', {'message': 'project Deleted with id {}'.format(record_id)}, namespace='/project', room=sid)

    result = await projectsModel.getProjects()
    await sio.emit('allProjects', result, namespace='/project')


@sio.on('updateProject', namespace='/project')
async def updateProject(sid, update_query):

    print("---------- Request from Session {} - with request {} ------- ".format(sid, update_query))

    result = await projectsModel.updateProject(update_query)
    await sio.emit('projectsResponse', {"message": "Updated project with row {}".format(result)}, namespace='/project', room=sid)

    result = await projectsModel.getProjects()
    await sio.emit('allProjects', result, namespace='/project')



# Domains Endpoints


@sio.on('getDomains', namespace='/domain')
async def getDomains(sid, project_id):

    print("---------- Request from Session {} -------------- ".format(sid))

    result = await domainsModel.getDomains(project_id)
    await sio.emit('allDomains', result, namespace='/domain', room=project_id)


@sio.on('createDomain', namespace='/domain')
async def createDomains(sid, data):

    print("---------- Request from Session {} -------------- ".format(sid))

    data = {"project_id": "1", "domain_id":"1", "domain_name":"New domain", "domain_description":"Test domain"}
    result = await domainsModel.createDomain(data)
    await sio.emit('domainResponse', {'message': 'Domain created with ID {}'.format(result)}, namespace='/domain', room=sid)


@sio.on('deleteDomain', namespace='/domain')
async def deleteDomains(sid):
    print(sid)
    print("Got request on Delete domain Resource")
    await sio.emit('domainResponse', {'message': 'domain Deleted '})


@sio.on('updateDomain', namespace='/domain')
async def updateDomains(sid):
    print(sid)
    print("Got request on Delete domain Resource")
    await sio.emit('domainResponse', {'message': 'domain Deleted '})


# We bind our aiohttp endpoint to our app


app.router.add_get('/', index)

# We kick off our server
if __name__ == '__main__':
    web.run_app(app, port=8089)
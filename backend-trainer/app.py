from aiohttp import web
import socketio
from models import dbname, projectsModel, domainsModel, intentsModel, responsesModel, storyModel, entityModel, refreshDB

# creates a new Async Socket IO Server

sio = socketio.AsyncServer(logger=True, engineio_logger=True)

''' Creates a new Aiohttp Web Application '''

app = web.Application()

# Binds our Socket.IO server to our Web App
# instance

sio.attach(app)

# we can define aiohttp endpoints just as we normally
# would with no change


async def index(request):
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')


''' Events handlers for connect and disconnect , nothing special is done except logging'''


@sio.on('connect')
def connect(sid, environ):
    print('connect ', sid)


@sio.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)


''' Events handlers for Join room and leave room , 
This method contains join room and leave room for all name spaces. This was introduced to ensure join room and leave 
room happens within the namespace'''


@sio.on('join_room', namespace='/project')
async def join_room(sid, room_name):
    print("________________________ User {} joined room {} with namespace /project_______________________".format(sid, room_name))
    sio.enter_room(sid, room=room_name, namespace='/project')
    sio.enter_room(sid, room=sid, namespace='/project')


@sio.on('leave_room', namespace='/project')
async def leave_room(sid, room_name):
    print("________________________ User {} Left room {} with namespace /project_______________________".format(sid, room_name))
    sio.leave_room(sid, room=room_name, namespace='/project')
    sio.leave_room(sid, room=sid, namespace='/project')


@sio.on('join_room', namespace='/domain')
async def join_room(sid, room_name):
    print("________________________ User {} joined room {} with namespace /domain _______________________".format(sid, room_name))
    sio.enter_room(sid, room=room_name, namespace='/domain')
    sio.enter_room(sid, room=sid, namespace='/domain')


@sio.on('leave_room', namespace='/domain')
async def leave_room(sid, room_name):
    print("________________________ User {} Left room {} with namespace /domain _______________________".format(sid, room_name))
    sio.leave_room(sid, room=room_name, namespace='/domain')
    sio.leave_room(sid, room=sid, namespace='/domain')


@sio.on('join_room', namespace='/intent')
async def join_room(sid, room_name):
    print("________________________ User {} joined room {} with namespace /intent _______________________".format(sid, room_name))
    sio.enter_room(sid, room=room_name, namespace='/intent')
    sio.enter_room(sid, room=sid, namespace='/intent')


@sio.on('leave_room', namespace='/intent')
async def leave_room(sid, room_name):
    print("________________________ User {} Left room {} with namespace /intent _______________________".format(sid, room_name))
    sio.leave_room(sid, room=room_name, namespace='/intent')
    sio.leave_room(sid, room=sid, namespace='/intent')


@sio.on('join_room', namespace='/response')
async def join_room(sid, room_name):
    print("________________________ User {} joined room {} with namespace /response _______________________".format(sid, room_name))
    sio.enter_room(sid, room=room_name, namespace='/response')
    sio.enter_room(sid, room=sid, namespace='/response')


@sio.on('leave_room', namespace='/response')
async def leave_room(sid, room_name):
    print("________________________ User {} Left room {} with namespace /response _______________________".format(sid, room_name))
    sio.leave_room(sid, room=room_name, namespace='/response')
    sio.leave_room(sid, room=sid, namespace='/response')


@sio.on('join_room', namespace='/story')
async def join_room(sid, room_name):
    print("________________________ User {} joined room {} with namespace /story _______________________".format(sid, room_name))
    sio.enter_room(sid, room=room_name, namespace='/story')
    sio.enter_room(sid, room=sid, namespace='/story')

@sio.on('leave_room', namespace='/story')
async def leave_room(sid, room_name):
    print("________________________ User {} Left room {} with namespace /story _______________________".format(sid, room_name))
    sio.leave_room(sid, room=room_name, namespace='/story')
    sio.leave_room(sid, room=sid, namespace='/story')


@sio.on('join_room', namespace='/dashboard')
async def join_room(sid, room_name):
    print("________________________ User {} joined room {} with namespace /dashboard _______________________".format(sid, room_name))
    sio.enter_room(sid, room=room_name, namespace='/dashboard')
    sio.enter_room(sid, room=sid, namespace='/dashboard')


@sio.on('leave_room', namespace='/dashboard')
async def leave_room(sid, room_name):
    print("________________________ User {} Left room {} with namespace /dashboard _______________________".format(sid, room_name))
    sio.leave_room(sid, room=room_name, namespace='/dashboard')
    sio.leave_room(sid, room=sid, namespace='/dashboard')


''' Refresh seed data. 

This method will wip off the mongo db instance of all user created data and reload it with seed data. 
This endpoint needs to be used with caution and ensure proper backup is taken before this is invoked '''


@sio.on('refresh_data', namespace='/refresh')
async def refresh_data(sid):
    print("##################################User {} Requested to refresh DB  ##########################".format(sid))

    result= await refreshDB.refreshdb()
    await sio.emit('refresh', result)


'''Projects Endpoints 

These contains methods to get all projects , update delete and insert new project in the mongo db'''


@sio.on('getProjects', namespace='/project')
async def getProjects(sid, room_name):

    print("---------- Request from Session {} -------------- ".format(sid))

    result = await projectsModel.getProjects()
    await sio.emit('allProjects', result, namespace='/project', room=room_name)


@sio.on('createProject', namespace='/project')
async def createProjects(sid, record, room_name):

    print("---------- Request from Session {} -- with record {} ------------ ".format(sid, record))

    message = await projectsModel.createProjects(record)
    await sio.emit('projectResponse', message, namespace='/project', room=sid)

    if message['status'] == 'Success':
        result = await projectsModel.getProjects()
        await sio.emit('allProjects', result, namespace='/project', room=room_name)


@sio.on('copyProject', namespace='/project')
async def copyProjects(sid, record, room_name):

    print("---------- Request from Session {} -- with record {} ------------ ".format(sid, record))

    message = await projectsModel.copyProject(record)
    await sio.emit('projectResponse', message, namespace='/project', room=sid)

    if message['status'] == 'Success':
        result = await projectsModel.getProjects()
        await sio.emit('allProjects', result, namespace='/project', room=room_name)


@sio.on('deleteProject', namespace='/project')
async def deleteProject(sid, object_id, room_name):

    print("---------- Request from Session {} --- with record {} ----------- ".format(sid, object_id))

    message = await projectsModel.deleteProject(object_id)
    await sio.emit('projectResponse', message, namespace='/project', room=sid)

    result = await projectsModel.getProjects()
    await sio.emit('allProjects', result, namespace='/project', room=room_name)


@sio.on('updateProject', namespace='/project')
async def updateProject(sid, update_query, room_name):

    print("---------- Request from Session {} - with record {} ------- ".format(sid, update_query))

    message = await projectsModel.updateProject(update_query)
    await sio.emit('projectResponse', message, namespace='/project', room=sid)

    if message['status'] == 'Success':
        result = await projectsModel.getProjects()
        await sio.emit('allProjects', result, namespace='/project', room=room_name)


# Domains Endpoints

@sio.on('getDomains', namespace='/domain')
async def getDomains(sid, project_id, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ---------- ".format(sid, project_id, room_name))

    result = await domainsModel.getDomains(project_id)
    await sio.emit('allDomains', result, namespace='/domain',room=room_name)


@sio.on('createDomain', namespace='/domain')
async def createDomain(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ---------- ".format(sid, data, room_name))

    message, domains_list = await domainsModel.createDomain(data)
    await sio.emit('domainResponse', message, namespace='/domain', room=sid)

    if domains_list is not None:
        await sio.emit('allDomains', domains_list, namespace='/domain', room=room_name)


@sio.on('deleteDomain', namespace='/domain')
async def deleteDomain(sid, data , room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ---------- ".format(sid, data, room_name))

    message, domains_list = await domainsModel.deleteDomain(data)

    await sio.emit('domainResponse', message,namespace='/domain', room=sid)
    await sio.emit('allDomains', domains_list, namespace='/domain', room=room_name)


@sio.on('updateDomain', namespace='/domain')
async def updateDomains(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    message, domains_list = await domainsModel.updateDomain(data)
    print("Message value {}".format(message))
    await sio.emit('domainResponse', message, room=sid, namespace='/domain')

    if domains_list is not None:
        await sio.emit('allDomains', domains_list, namespace='/domain', room=room_name)


# intents Endpoint


@sio.on('getIntents', namespace='/dashboard')
async def getIntents(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))
    intents_list = await intentsModel.getIntents(data)
    await sio.emit('allIntents', intents_list, namespace='/dashboard', room=room_name)


@sio.on('createIntent', namespace='/dashboard')
async def createIntent(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    message, intents_list= await intentsModel.createIntent(data)
    await sio.emit('intentResponse', message, namespace='/dashboard', room=sid)

    if intents_list is not None:
        await sio.emit('allIntents', intents_list, namespace='/dashboard', room=room_name)


@sio.on('deleteIntent', namespace='/dashboard')
async def deleteIntent(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    message, intents_list = await intentsModel.deleteIntent(data)

    await sio.emit('intentResponse', message, namespace='/dashboard', room=sid)
    await sio.emit('allIntents', intents_list, namespace='/dashboard', room=room_name)


@sio.on('updateIntent', namespace='/dashboard')
async def updateIntent(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    message, intents_list = await intentsModel.updateIntent(data)
    await sio.emit('intentResponse', message,namespace='/dashboard', room=sid)

    if intents_list is not None:
        await sio.emit('allIntents', intents_list, namespace='/dashboard', room=room_name)


# responses Endpoints


@sio.on('getResponses', namespace='/dashboard')
async def getResponses(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    responses_list = await responsesModel.getResponses(data)
    await sio.emit('allResponses', responses_list, namespace='/dashboard', room=room_name)


@sio.on('createResponse', namespace='/dashboard')
async def createResponse(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    message, responses_list = await responsesModel.createResponse(data)

    await sio.emit('respResponse', message, namespace='/dashboard', room=sid)

    if responses_list is not None:
        await sio.emit('allResponses', responses_list, namespace='/dashboard', room=room_name)


@sio.on('deleteResponse', namespace='/dashboard')
async def deleteResponse(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    message, responses_list = await responsesModel.deleteResponse(data)

    await sio.emit('respResponse', message, namespace='/dashboard', room=sid)
    await sio.emit('allResponses', responses_list, namespace='/dashboard', room=room_name)


@sio.on('updateResponse', namespace='/dashboard')
async def updateResponse(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    message, responses_list = await responsesModel.updateResponse(data)
    await sio.emit('respResponse', message, namespace='/dashboard', room=sid)

    if responses_list is not None:
        await sio.emit('allResponses', responses_list, namespace='/dashboard', room=room_name)


# Endpoints for Stories


@sio.on('getStories', namespace='/dashboard')
async def getStories(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "123", "domain_id": "1"}

    stories_list = storyModel.getStories(data)

    await sio.emit('allStories', stories_list, namespace='/dashboard', room=room_name)


@sio.on('createStory', namespace='/story')
async def createStory(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "1", "domain_id": "1", "story_id":"1", "story_name": "ABC Intent", "story_description": "DHKJSNDAN"}

    insert_result, stories_list = await storyModel.createStory(data)

    await sio.emit('storyResponse', {'message': 'Story has been inserted with ID {}'.format(insert_result)},namespace='/story', room=sid)
    await sio.emit('allStories', stories_list, namespace='/story', room=room_name)


@sio.on('deleteStory', namespace='/story')
async def deleteStory(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "1", "domain_id": "1", "object_id": "kasjdhkjansd"}

    delete_result, stories_list = await storyModel.deleteStory(data)

    await sio.emit('intentResponse', {'message': 'Story has been deleted with ID {}'.format(delete_result)},namespace='/story', room=sid)
    await sio.emit('allResponses', stories_list, namespace='/story', room=room_name)


@sio.on('updateStory', namespace='/story')
async def updateStory(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "12", "domain_id": "123", "object_id":"abbdkkdnsd", "story_id":"1", "story_name": "abc", "story_description": "Abbskkskndkjn"}

    update_result , stories_list = await storyModel.updateStory(data)

    await sio.emit('intentResponse', {'message': 'Story has been updated with ID {}'.format(update_result)},namespace='/story', room=sid)
    await sio.emit('allResponses', stories_list, namespace='/story', room=room_name)


# Entities Endpoints

@sio.on('getEntities', namespace='/entity')
async def getEntities(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "123"}

    entities_list = entityModel.getEntities(data)

    await sio.emit('allEntities', entities_list, namespace='/entity', room=room_name)


# We bind our aiohttp endpoint to our app


app.router.add_get('/', index)

# We kick off our server
if __name__ == '__main__':
    sio.attach(app)
    web.run_app(app, port=8089)
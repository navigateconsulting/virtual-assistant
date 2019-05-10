from aiohttp import web
import socketio

from models import dbname, projectsModel, domainsModel, intentsModel, responsesModel, storyModel

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

# Connect Disconnect events


@sio.on('connect')
def connect(sid, environ):
    print('connect ', sid)


@sio.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)


# Rooms Hooks

@sio.on('join_room')
async def join_room(sid, namespace_value, room_name):
    print("________________________ User {} joined room {} with namespace {}_______________________".format(sid, room_name, namespace_value))
    sio.enter_room(sid, room=room_name, namespace=namespace_value)


@sio.on('leave_room')
async def leave_room(sid, namespace_value, room_name):
    print("________________________ User {} Left room {} with namespace {}_______________________".format(sid, room_name, namespace_value))
    sio.leave_room(sid, room_name, namespace=namespace_value)


# projects Endpoints


@sio.on('getProjects', namespace='/project')
async def getProjects(sid, room_name):

    print("---------- Request from Session {} -------------- ".format(sid))

    result = await projectsModel.getProjects()
    await sio.emit('allProjects', result, namespace='/project', room=room_name)


@sio.on('createProject', namespace='/project')
async def createProjects(sid, record, room_name):

    print("---------- Request from Session {} -- with record {} ------------ ".format(sid, record))

    record_id= await projectsModel.createProjects(record)
    await sio.emit('projectResponse', {"message": "Project created with ID {} ".format(record_id)}, namespace='/project', room=sid)

    result = await projectsModel.getProjects()
    await sio.emit('allProjects', result, namespace='/project', room=room_name)


@sio.on('deleteProject', namespace='/project')
async def deleteProject(sid, object_id, room_name):

    print("---------- Request from Session {} --- with record {} ----------- ".format(sid, object_id))

    record_id = await projectsModel.deleteProject(object_id)
    await sio.emit('projectsResponse', {'message': 'project Deleted with id {}'.format(record_id)}, namespace='/project', room=sid)

    result = await projectsModel.getProjects()
    await sio.emit('allProjects', result, namespace='/project', room=room_name)


@sio.on('updateProject', namespace='/project')
async def updateProject(sid, update_query, room_name):

    print("---------- Request from Session {} - with record {} ------- ".format(sid, update_query))

    result = await projectsModel.updateProject(update_query)
    await sio.emit('projectsResponse', {"message": "Updated project with row {}".format(result)}, namespace='/project', room=sid)

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

    data = {"project_id": "1", "domain_id":"1", "domain_name":"New domain", "domain_description":"Test domain"}

    insert_result, domains_list = await domainsModel.createDomain(data)

    await sio.emit('domainResponse', {'message': 'Domain created with ID {}'.format(insert_result)}, namespace='/domain', room=sid)
    await sio.emit('allDomains', domains_list, namespace='/domain', room=room_name)


@sio.on('deleteDomain', namespace='/domain')
async def deleteDomain(sid, data , room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ---------- ".format(sid, data, room_name))

    data = {"project_id": "123", "object_id": "abbsdskdlkscnksnc"}

    delete_result, domains_list = await domainsModel.deleteDomain(data)

    await sio.emit('domainResponse', {'message': 'Domain deleted with ID {}'.format(delete_result)},namespace='/domain', room=sid)
    await sio.emit('allDomains', domains_list, namespace='/domain', room=room_name)


@sio.on('updateDomain', namespace='/domain')
async def updateDomains(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "123", "object_id": "1233", "domain_id": "1", "domain_name":"name ", "domain_description": "Domain Description"}

    update_result, domains_list = await domainsModel.updateDomain(data)

    await sio.emit('domainResponse', {'message': 'Domain updated with ID {}'.format(update_result)}, namespace='/domain', room=sid)
    await sio.emit('allDomains', domains_list, namespace='/domain', room=room_name)


# Endpoints to get all intents in a particular domain


@sio.on('getIntents', namespace='/intent')
async def getIntents(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "123", "domain_id": "1"}

    intents_list = intentsModel.getIntents(data)

    await sio.emit('allIntents', intents_list, namespace='/intent', room=room_name)


@sio.on('createIntent', namespace='/intent')
async def createIntent(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "1", "domain_id": "1", "intent_id":"1", "intent_name": "ABC Intent", "intent_description": "DHKJSNDAN"}

    insert_result, intents_list = await intentsModel.createIntent(data)

    await sio.emit('intentResponse', {'message': 'Intent has been inserted with ID {}'.format(insert_result)},namespace='/intent', room=sid)
    await sio.emit('allIntents', intents_list, namespace='/intent', room=room_name)


@sio.on('deleteIntent', namespace='/intent')
async def deleteIntent(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "1", "domain_id": "1", "object_id": "kasjdhkjansd"}

    delete_result, intents_list = await intentsModel.deleteIntent(data)

    await sio.emit('intentResponse', {'message': 'Intent has been deleted with ID {}'.format(delete_result)},namespace='/intent', room=sid)
    await sio.emit('allIntents', intents_list, namespace='/intent', room=room_name)


@sio.on('updateIntent', namespace='/intent')
async def updateIntent(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "12", "domain_id": "123", "object_id":"abbdkkdnsd", "intent_id":"1", "intent_name": "abc", "intent_description": "Abbskkskndkjn"}

    update_result , intents_list = await intentsModel.updateIntent(data)

    await sio.emit('intentResponse', {'message': 'Intent has been updated with ID {}'.format(update_result)},namespace='/intent', room=sid)
    await sio.emit('allIntents', intents_list, namespace='/intent', room=room_name)


# Endpoints to get responses


@sio.on('getResponses', namespace='/response')
async def getResponses(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "123", "domain_id": "1"}

    responses_list = responsesModel.getResponses(data)

    await sio.emit('allResponses', responses_list, namespace='/response', room=room_name)


@sio.on('createResponse', namespace='/response')
async def createResponse(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "1", "domain_id": "1", "response_id":"1", "response_name": "ABC Intent", "response_description": "DHKJSNDAN"}

    insert_result, responses_list = await responsesModel.createResponse(data)

    await sio.emit('intentResponse', {'message': 'Response has been inserted with ID {}'.format(insert_result)},namespace='/response', room=sid)
    await sio.emit('allResponses', responses_list, namespace='/response', room=room_name)


@sio.on('deleteResponse', namespace='/response')
async def deleteResponse(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "1", "domain_id": "1", "object_id": "kasjdhkjansd"}

    delete_result, responses_list = await responsesModel.deleteResponse(data)

    await sio.emit('intentResponse', {'message': 'Response has been deleted with ID {}'.format(delete_result)},namespace='/response', room=sid)
    await sio.emit('allResponses', responses_list, namespace='/response', room=room_name)


@sio.on('updateResponse', namespace='/response')
async def updateResponse(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "12", "domain_id": "123", "object_id":"abbdkkdnsd", "response_id":"1", "response_name": "abc", "response_description": "Abbskkskndkjn"}

    update_result , responses_list = await responsesModel.updateResponse(data)

    await sio.emit('intentResponse', {'message': 'Response has been updated with ID {}'.format(update_result)},namespace='/response', room=sid)
    await sio.emit('allResponses', responses_list, namespace='/response', room=room_name)


# Endpoints for Stories


@sio.on('getStories', namespace='/story')
async def getStories(sid, data, room_name):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "123", "domain_id": "1"}

    stories_list = storyModel.getStories(data)

    await sio.emit('allStories', stories_list, namespace='/story', room=room_name)


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





# We bind our aiohttp endpoint to our app


app.router.add_get('/', index)

# We kick off our server
if __name__ == '__main__':
    web.run_app(app, port=8089)
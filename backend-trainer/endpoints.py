from . import app
from . import sio

@sio.on('getEntities', namespace='/entity')
async def getEntities(sid, data):

    print("---------- Request from Session {} -- with record {} -- and room {} ----------  ".format(sid, data, room_name))

    data = {"project_id": "123"}

    entities_list = entityModel.getEntities(data)

    await sio.emit('allEntities', entities_list, namespace='/entity')

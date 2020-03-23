from __main__ import sio

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


@sio.on('join_room', namespace='/nav')
async def join_room(sid, room_name):
    print("________________________ User {} joined room {} with namespace /dashboard _______________________".format(sid, room_name))
    sio.enter_room(sid, room=room_name, namespace='/nav')
    sio.enter_room(sid, room=sid, namespace='/nav')


@sio.on('leave_room', namespace='/nav')
async def leave_room(sid, room_name):
    print("________________________ User {} Left room {} with namespace /dashboard _______________________".format(sid, room_name))
    sio.leave_room(sid, room=room_name, namespace='/nav')
    sio.leave_room(sid, room=sid, namespace='/nav')


@sio.on('join_room', namespace='/trynow')
async def join_room(sid, room_name):
    print("________________________ User {} joined room {} with namespace /trynow _______________________".format(sid, room_name))
    sio.enter_room(sid, room=room_name, namespace='/trynow')
    sio.enter_room(sid, room=sid, namespace='/trynow')


@sio.on('leave_room', namespace='/trynow')
async def leave_room(sid, room_name):
    print("________________________ User {} Left room {} with namespace /trynow _______________________".format(sid, room_name))
    sio.leave_room(sid, room=room_name, namespace='/trynow')
    sio.leave_room(sid, room=sid, namespace='/trynow')


@sio.on('join_room', namespace='/modelpublish')
async def join_room(sid, room_name):
    print("________________________ User {} joined room {} with namespace /modelpublish _______________________".format(sid, room_name))
    sio.enter_room(sid, room=room_name, namespace='/modelpublish')
    sio.enter_room(sid, room=sid, namespace='/modelpublish')


@sio.on('leave_room', namespace='/modelpublish')
async def leave_room(sid, room_name):
    print("________________________ User {} Left room {} with namespace /modelpublish _______________________".format(sid, room_name))
    sio.leave_room(sid, room=room_name, namespace='/modelpublish')
    sio.leave_room(sid, room=sid, namespace='/modelpublish')

@sio.on('join_room', namespace='/action')
async def join_room(sid, room_name):
    print("________________________ User {} joined room {} with namespace /action_______________________".format(sid, room_name))
    sio.enter_room(sid, room=room_name, namespace='/action')
    sio.enter_room(sid, room=sid, namespace='/action')


@sio.on('leave_room', namespace='/action')
async def leave_room(sid, room_name):
    print("________________________ User {} Left room {} with namespace /action_______________________".format(sid, room_name))
    sio.leave_room(sid, room=room_name, namespace='/action')
    sio.leave_room(sid, room=sid, namespace='/action')

@sio.on('join_room', namespace='/conversation')
async def join_room(sid, room_name):
    print("________________________ User {} joined room {} with namespace /conversation_______________________".format(sid, room_name))
    sio.enter_room(sid, room=room_name, namespace='/conversation')
    sio.enter_room(sid, room=sid, namespace='/conversation')


@sio.on('leave_room', namespace='/conversation')
async def leave_room(sid, room_name):
    print("________________________ User {} Left room {} with namespace /conversation_______________________".format(sid, room_name))
    sio.leave_room(sid, room=room_name, namespace='/conversation')
    sio.leave_room(sid, room=sid, namespace='/conversation')

@sio.on('join_room', namespace='/aconversation')
async def join_room(sid, room_name):
    print("________________________ User {} joined room {} with namespace /conversation_______________________".format(sid, room_name))
    sio.enter_room(sid, room=room_name, namespace='/conversation')
    sio.enter_room(sid, room=sid, namespace='/conversation')


@sio.on('leave_room', namespace='/aconversation')
async def leave_room(sid, room_name):
    print("________________________ User {} Left room {} with namespace /conversation_______________________".format(sid, room_name))
    sio.leave_room(sid, room=room_name, namespace='/conversation')
    sio.leave_room(sid, room=sid, namespace='/conversation')
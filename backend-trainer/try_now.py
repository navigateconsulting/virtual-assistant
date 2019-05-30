import rasa
import rasa.model as model
import asyncio
from rasa.core.agent import Agent
from __main__ import sio
from rasa.core.tracker_store import MongoTrackerStore
from rasa.core.domain import Domain
import json

#agent: "Agent"
loop = None
session_id = ""


class TryNow:

    def __init__(self):
        self.base_path = '../vol_chatbot_data/temp/trainer-sessions/'
        self.config = "config.yml"
        self.training_files = "data/"
        self.domain = "domain.yml"
        self.output = "models/"
        self.session_id = ''
        #self.agent: "Agent"

    def chat_now(self, sid, data):
        #global agent
        global loop
        global session_id
        session_id = sid
        print("received Data {} form session ID {}".format(data, session_id))
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        # Set paths for the project

        self.base_path = self.base_path + sid + "/"

        self.config = self.base_path + self.config
        self.training_files = self.base_path + self.training_files
        self.domain = self.base_path + self.domain
        self.output = self.base_path + self.output

        print("Config file selected in this run {}".format(self.config))

        model_path = rasa.train(self.domain, self.config, [self.training_files], self.output)
        unpacked = model.get_model(model_path)
        domain = Domain.load(self.domain)
        _tracker_store = MongoTrackerStore( domain=domain,
                                            host="mongodb://localhost:27017",
                                            db="eva_platform",
                                            username=None,
                                            password=None,
                                            auth_source="admin",
                                            collection="conversations",
                                            event_broker=None)
        agent = Agent.load(unpacked, tracker_store=_tracker_store)
        loop.run_until_complete(sio.emit('chatResponse', {"status": "Success", "message": "Ready to chat"}, namespace='/trynow', room=session_id))
        print("_________________________________ Session ID after Train{} ___________".format(session_id))

        while True:

            @sio.on('chatNow', namespace='/trynow')
            async def chat_now(sid_new, message):
                responses = await agent.handle_text(message, sender_id=sid_new)

                for response in responses:
                    print("--------- BOT Response {}".format(response))
                    await sio.emit('chatResponse', response, namespace='/trynow', room_name=sid_new, broadcast=False)

'''
    @sio.on('chatNow', namespace='/trynow')
    async def handle_incoming(self, message):
        global agent
        global loop
        global session_id
        #loop = asyncio.get_event_loop()

        print("________________________________ Session ID During chat Now {}_______________".format(session_id))

        responses = await agent.handle_text(message, sender_id=session_id)

        if 1 == 1:

            if message == '/restart':
                await sio.emit('chatResponse', {"receipient_id": session_id, "text": "Bot Restarted"}, namespace='/trynow', room_name=session_id)

            for response in responses:
                print("--------- BOT Response {}".format(response))
                await sio.emit('chatResponse', response, namespace='/trynow', room_name=session_id, broadcast=False)

'''
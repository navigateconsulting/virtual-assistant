import rasa
import rasa.model as model
import asyncio
from rasa.core.agent import Agent
from __main__ import sio
from rasa.core.tracker_store import MongoTrackerStore
from rasa.core.domain import Domain

agent: "Agent"
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
        global agent

    def chat_now(self, sid, room_name, data):
        global agent
        global loop
        global session_id
        session_id = sid
        print("received Data {} room_name {}".format(data, room_name))
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
        loop.run_until_complete(sio.emit('chatResponse', {"status": "Success", "message": "Ready to chat"}, namespace='/trynow', room=room_name))

    @sio.on('chatNow', namespace='/trynow')
    async def handle_incoming(self, message):
        global agent
        global loop
        global session_id

        responses = await agent.handle_text(message, sender_id=session_id)
        for response in responses:
            print("--------- BOT Response {}".format(response))
            await sio.emit('chatResponse', response, namespace='/trynow', room_name = session_id)


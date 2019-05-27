import rasa
import rasa.model as model
import asyncio
from rasa.core.agent import Agent
from __main__ import sio

agent: "Agent"
loop = None


class TryNow:

    def __init__(self):
        self.base_path = '../vol_chatbot_data/temp/trainer-sessions/example_folder/'
        self.config = self.base_path + "config.yml"
        self.training_files = self.base_path + "data/"
        self.domain = self.base_path + "domain.yml"
        self.output = self.base_path + "models/"
        global agent

    def chat_now(self):
        global agent
        global loop

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        model_path = rasa.train(self.domain, self.config, [self.training_files], self.output)
        unpacked = model.get_model(model_path)
        agent = Agent.load(unpacked)

    @sio.on('chatNow', namespace='/trynow')
    async def handle_incoming(self, message):
        global agent
        global loop

        responses = await agent.handle_text(message)
        for response in responses:
            print("--------- BOT Response {}".format(response))
            await sio.emit('chatResponse', response, namespace='/trynow')


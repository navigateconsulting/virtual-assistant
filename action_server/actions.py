from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
import json
import logging
logger = logging.getLogger(__name__)


class ActionJoke(Action):
    def name(self):
        return "action_joke"

    def run(self, dispatcher, tracker, domain):
        request = requests.get('http://api.icndb.com/jokes/random').json()  # Makefile an api call
        joke = request['value']['joke']  # extract a joke from returned json response
        dispatcher.utter_message(joke)  # send the message back to the user
        return []

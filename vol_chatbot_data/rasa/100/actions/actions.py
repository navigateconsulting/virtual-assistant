import requests
import json
from rasa_core_sdk import Action


class ActionJoke(Action):
  def name(self):
    return "action_joke"

  def run(self, dispatcher, tracker, domain):
    request = requests.get('http://api.icndb.com/jokes/random').json() #make an api call
    joke = request['value']['joke'] #extract a joke from returned json response
    dispatcher.utter_message(joke) #send the message back to the user
    return []

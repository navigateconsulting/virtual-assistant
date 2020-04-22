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
        request = requests.get('http://api.icndb.com/jokes/random').json()  # make an api call
        joke = request['value']['joke']  # extract a joke from returned json response
        dispatcher.utter_message(joke)  # send the message back to the user
        return []

class ActionLogServiceRequest(Action):

    def name(self):
        return 'action_esas_log_service_request'

    def run(self, dispatcher, tracker, domain):
        url = 'http://esas_api_gateway:5000/api/v1/incident'
        user_id = tracker.sender_id
        service_group = "Queue"
        all_slots = tracker.current_slot_values()
        issue_details = tracker.get_slot('issue_details')
        headers = {'content-type': 'application/json'}
        insert_record = {"created_by": user_id, "request_summary": issue_details, "request_description": issue_details, "assign_group_name": service_group, "status": '1', "priority": '1', "assignee": 'null', "resolution": "", "last_assigned_by": 'null', "slot_values": json.dumps(all_slots)}
        x = requests.post(url, data=json.dumps(insert_record), headers=headers)
        logging.warning(x)
        if x.status_code == 200:
            dispatcher.utter_message("New incident has been created")
        else:
            dispatcher.utter_message("Incident creation failed. Need more data.")
        return []
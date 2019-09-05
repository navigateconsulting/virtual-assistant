# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/core/customactions/#custom-actions-written-in-python


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

import cx_Oracle

# Connect to oracle database
connection = cx_Oracle.connect("apps", "apps", "vision.ncbs.com/VIS")


class ActionOnhandQuantity(Action):

    def name(self) -> Text:
        return "action_onhand_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        cursor = connection.cursor()
        cursor.execute("select transaction_id from mtl_material_transactions where rownum = 1")

        for transaction_id in cursor:
            dispatcher.utter_message("Transaction ID is {}".format(transaction_id))

        #dispatcher.utter_message("My first action ")

        return []
import requests
import json

from pymongo import MongoClient
client = MongoClient('mongodb', 27017)
db = client['eva_platform']



import logging
logger = logging.getLogger(__name__)


class ActionHelloWorld(Action):

    def name(self) -> Text:
        return "action_hello_world"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message("My first action ")

        return []

class ActionGetNews(Action):

    def name(self):
        return 'action_fetch_news'

    def run(self, dispatcher, tracker, domain):
        category = tracker.get_slot('news_category')
        url = 'https://api.nytimes.com/svc/news/v3/content/all/{category}.json'.format(category=category)
        params = {'api-key': "JBCmqeNP6PjnoxEUmQHQ558ImYGwTYEh", 'limit': 5}
        response = requests.get(url, params).text
        json_data = json.loads(response)['results']
        i = 0
        for results in json_data:
            i = i+1
            message = str(i) + "." + results['abstract']
            dispatcher.utter_message(message)
        return[]

class ActionPalletsPOC(Action):

    def name(self):
        return 'action_poc_pallets'

    def run(self, dispatcher, tracker, domain):
        customer_no = tracker.get_slot('customer_no')
        ship_to = tracker.get_slot('ship_to')
        mode_of_transport = tracker.get_slot('mode_of_transport')
        max_carrier_weight = tracker.get_slot('max_carrier_weight')
        pallet_numbers = tracker.get_slot('pallet_numbers')
        logging.warning('inside the custom action')
        insert_record = {"customer_no": customer_no, "ship_to": ship_to[2:], "max_carrier_weight": max_carrier_weight,
                         "mode_of_transport": mode_of_transport, "pallet_numbers": pallet_numbers}
        
        logging.warning(insert_record)
        insert_result = db.poc_demo.insert_one(json.loads(json.dumps(insert_record)))
        logging.warning(insert_result)
        if insert_result:
            dispatcher.utter_message("Shipment procedure in process")
        else:
            dispatcher.utter_message("Shipment procedure failed")
        
        return []

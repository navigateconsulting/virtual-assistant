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


class ActionHelloWorld(Action):

    def name(self) -> Text:
        return "action_hello_world"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message("My first action ")

        return []

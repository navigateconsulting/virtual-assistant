import configparser
import requests 
import json
import signal
import sys
import logging
from confluent_kafka import Consumer, KafkaException, KafkaError
import time
import uuid

class skype_message_processor:

  def __init__(self):
      ## Instantiate Requests Session object 
      self.sess=requests.Session()
      conf = {'bootstrap.servers': 'kafka:29092', 'group.id': 'skype_send_message', 'session.timeout.ms': 6000,
            'auto.offset.reset': 'earliest'}

      # Create logger for consumer (logs will be emitted when poll() is called)
      logger = logging.getLogger('consumer')
      logger.setLevel(logging.DEBUG)
      handler = logging.StreamHandler()
      handler.setFormatter(logging.Formatter('%(asctime)-15s %(levelname)-8s %(message)s'))
      logger.addHandler(handler)
    
      # Create Consumer instance
      # Hint: try debug='fetch' to generate some log messages
      self.c = Consumer(conf, logger=logger)

      self.topics='skype_events_stream'
      self.refresh_keys()
      # Subscribe to topics
      self.c.subscribe(["skype_events_stream"], on_assign=self.print_assignment)
      
      ## Config for Rasa Core instance 
      self.rasa_url='http://rasa_core:5005/webhooks/rest/webhook'

      self.rasa_heads =  {'Content-type': 'application/json'}


  def print_assignment(self,consumer, partitions):
      print('Assignment:', partitions)

  def sigterm_handler(self,signal, frame):
      # save the state here or do whatever you want
      print('Terminating Skype Master handler')
      self.c.close()
      self.terminate_application()
      sys.exit(0)


  def refresh_keys(self):
      try:
         time.sleep(3)
         config_new = configparser.ConfigParser()
         config_new.read('data/skype.ini')
         self.authtoken=config_new['SKYPE']['authtoken']
         self.huburl=config_new['SKYPE']['HUBURL']
         self.events_url=config_new['SKYPE']['START_EVENTSURL']
         self.events_url=self.events_url.replace('%%','%')
         print("After refreshing token , Events URL",self.events_url)
         self.sess.headers.update({
                'Accept': "application/json",
                'Content-Type': 'text/plain',
                'Authorization':self.authtoken
          })
      except:
         time.sleep(3)


  def send_message(self):
      ## Checking for token expiry
      if self.huburl == str('EXPIRED'):
         print("Expired token ")

         ## Token seems to have expired , waiting for refreshed tokens
         self.refresh_keys()
         return

      else:
        
         ## Reading from kafka Stream 
  
         #msg = self.c.poll(timeout=1.0)
         msg = self.c.poll()
            
         if msg is None:
            return
         if msg.error():
            # Error or event
            if msg.error().code() == KafkaError._PARTITION_EOF:
                # End of partition event
               print('End of Partition reached end at offset ',msg.topic(), msg.partition(), msg.offset())
               return
            else:
                # Error
               #raise KafkaException(msg.error())
               return
         else:
             # processing Message here.
             #sys.stderr.write('%% %s [%d] at offset %d with key %s:\n' %
             #                 (msg.topic(), msg.partition(), msg.offset(),
             #                  str(msg.key())))
             print('Received message at topic partition  offset and key ',msg.value())
             message = msg.value()
             message = json.loads(message)
             print("Message value ",message['message'])
             #print(msg.topic(), msg.partition(), msg.offset(),str(msg.key())

             ## Pass message to rasa core for parsing 
             rasa_params= json.dumps({'sender':message['contact_name'], 'message': message['message']})
             rasa_response = requests.post(self.rasa_url,data=rasa_params , headers= self.rasa_heads)

             try:
               res=rasa_response.json()[0]['text']
               message_text= rasa_response.json()[0]['text']
               print("Got message from Rasa ")
             except (IndexError, KeyError, TypeError):
               message_text = 'No response'
               print("No message from Rasa  ")

             #setting operating context 
             #generate a random GUIID
             random_guiid = str(uuid.uuid4())
             OperationContext="?OperationContext="+random_guiid
             #message=queue.get()
             #message_url = message[3] 
             #message_text = 'Daas here got message - '+message['contact_name']+' from - '+message['message']
             
             #res=requests.post(url=self.huburl+message['send_message_link']+OperationContext,headers=post_headers,data=message)
             res=self.sess.post(url=self.huburl+message['send_message_link']+OperationContext,data=message_text)

             if res.status_code == 401:
                print("Status of the response",res.status_code)
                print("Status of the response",res.text)
             # 
             #    ## Token seems to have expired , waiting for refreshed tokens
             #    self.refresh_keys()
             #    return

def main():
  client=skype_message_processor()

  signal.signal(signal.SIGTERM, client.sigterm_handler)

  while True:
      #time.sleep(3)
     client.send_message()

main()

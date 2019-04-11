import configparser
import sys  
import time 
import requests 
from urllib.parse import unquote 
import lxml.html
import re 
from confluent_kafka import Producer
import json
import signal

class skype_events_processor:

  def __init__(self):
      ## Instantiate Requests Session object 
      self.sess=requests.Session()
      self.refresh_keys()
      self.p1 = Producer({'bootstrap.servers':'kafka:29092'})
      #self.p2 = Producer({'bootstrap.servers':'kafka:29092'})


  def sigterm_handler(self,signal, frame):
      # save the state here or do whatever you want
      print('Terminating Skype Events processor  handler')
      self.p1.flush()
      self.p2.flush()
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
                'Connection': "keep-alive",
                'Accept-Encoding':"gzip, deflate",
                'Authorization':self.authtoken
          })
      except:
         time.sleep(3)


  def delivery_callback(self,err, msg):
      if err:
         print('In Call back error',err)
      else:
         print('message delivered ',msg.topic(), msg.partition(), msg.offset())

  def get_post_headers(self):
        generic_post_headers={
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': self.authtoken
            }
        return generic_post_headers

  def process_events(self):
      
      ## Checking for token expiry

      if self.huburl == str('EXPIRED'):
         print("Expired token ")

         ## Token seems to have expired , waiting for refreshed tokens
         self.refresh_keys()
         return

      else:

         ## Performing a get on the events URL 
         res=self.sess.get(url=self.huburl+self.events_url)
      
         if res.status_code == 401:
            print("Status of the response",res.status_code)
            print("Status of the response",res.text)
         
            ## Token seems to have expired , waiting for refreshed tokens
            self.refresh_keys()
            return

      print("Processing events",res.json())

      try:
         print("Events URL ",res.json()['_links']['next']['href'])

         self.events_url =res.json()['_links']['next']['href']
         print("Events Dump ",res.json())
      except:
         self.refresh_keys()
         return

      ## First loop would try to find any incomming conversations and accecpt the conversation.
      ## Second loop in elif section would check for any incomming messages and get details of them

      for sender in res.json()['sender']:
          if sender['rel'] == "communication":
              for event in sender['events']:
                  if '_embedded' in event:
                      for action in event['_embedded']:
                          if action == 'messagingInvitation':
                              if event['_embedded'][action]['direction'] == "Incoming":
                                  if 'accept' in event['_embedded']['messagingInvitation']['_links']:
                                      ## Retrive the Accecpt URL Link 
                                      accept_url= event['_embedded']['messagingInvitation']['_links']['accept']['href']
                                      ## Perform a POST on the Accecpt URL to accecpt the conversation 
                                      res_accecpt= requests.post(url=self.huburl+accept_url,headers=self.get_post_headers())
                                      print("Accecpted Conversation Status",res_accecpt)

          elif sender['rel'] == "conversation":
              for event in sender['events']:
                  if event['link']['rel'] == 'message':
                      if 'htmlMessage' in event['_embedded']['message']['_links']:
                              raw = event['_embedded']['message']['_links']['htmlMessage']['href']
                              ## get Message text from the response 
                              ## processing raw text to get content.
                              ## convert from charset to HTML
                              ## Getting rid of HTML Content
                              ## Getting headers and adders out
                              message = unquote(raw)   
                              message = lxml.html.document_fromstring(message)  
                              message = message.text_content()
                              message = message.replace('data:text/html;charset=utf-8,','')  
                              message = message.replace('+',' ')
                              message = message.strip()

                              ## Get Contact person URI 
                              getContact = r'(people/)(.*)'
                              contact_uri=event['_embedded']['message']['_links']['contact']['href']
                              contact_uri = re.search(getContact,contact_uri).group(2)

                              ## get Contact name
                              contact_name=event['_embedded']['message']['_links']['participant']['title']

                              ## get messaging URL and derive reply URL for this conversation
                              messaging_url=event['_embedded']['message']['_links']['messaging']['href']
                              send_message_link=messaging_url+'/messages'
                              stop_message_link=messaging_url+'/terminate'

                              ## Print Information for debug
                              print('************ Messages from Event stream ***************************')
                              #print("Messaging URL for current conversation =>",messaging_url)
                              print("Contact name =>",contact_name)
                              print('Received Message =>',message)
                              #print("Contact URI =>",contact_uri)
                              #print("Send Message Link =>",send_message_link)
                              #print("Stop messaging Link =>",stop_message_link)
                              message_obj=json.dumps({'conversation_id':1,
                                                      'contact_url':contact_uri,
                                                      'contact_name':contact_name,
                                                      'message':message,
                                                      'send_message_link':send_message_link,
                                                      'stop_message_link':stop_message_link})


                              self.p1.produce('skype_events_stream', message_obj.encode('utf-8'), callback=self.delivery_callback)
                              self.p1.poll(0)
                              print('HTML Message Published to Kafka')

                      if 'plainMessage' in event['_embedded']['message']['_links']:
                              raw = event['_embedded']['message']['_links']['plainMessage']['href']

                              ## Skype for buisness Andriod and iOS / Mac app does not send HTML Content , so adding another loop to handle plain messages 
                              ## get Message text from the response 
                              ## processing raw text to get content.
                              ## Getting headers and adders out
                              message = unquote(raw)   
                              message = message.replace('data:text/plain;charset=utf-8,','')  
                              message = message.replace('+',' ')

                              ## Get Contact person URI 
                              print('Received raw Plaintext message ',raw)
                              getContact = r'(people/)(.*)'
                              contact_uri=event['_embedded']['message']['_links']['contact']['href']
                              contact_uri = re.search(getContact,contact_uri).group(2)

                              ## get Contact name
                              contact_name=event['_embedded']['message']['_links']['participant']['title']

                              ## get messaging URL and derive reply URL for this conversation
                              messaging_url=event['_embedded']['message']['_links']['messaging']['href']
                              send_message_link=messaging_url+'/messages'
                              stop_message_link=messaging_url+'/terminate'

                              ## Print Information for debug
                              print('************ Messages from Event stream ***************************')
                              #print("Messaging URL for current conversation =>",messaging_url)
                              print("Contact name =>",contact_name)
                              print('Received Message =>',message)
                              #print("Contact URI =>",contact_uri)
                              #print("Send Message Link =>",send_message_link)
                              #print("Stop messaging Link =>",stop_message_link)
                              message_obj=json.dumps({'conversation_id':1,
                                                      'contact_url':contact_uri,
                                                      'contact_name':contact_name,
                                                      'message':message,
                                                      'send_message_link':send_message_link,
                                                      'stop_message_link':stop_message_link})

                              self.p1.produce('skype_events_stream', message_obj.encode('utf-8'), callback=self.delivery_callback)
                              self.p1.poll(0)
                              print("Plaintext message produced to Kafka ")
                              #self.p1.flush()
        ## Out of the loop at the end.




def main():
  client= skype_events_processor()

  signal.signal(signal.SIGTERM, client.sigterm_handler)

  while True:
     client.process_events()

main()

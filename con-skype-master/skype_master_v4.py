import adal  ## Azure Active Directory authentication library
import json    ## Json data handling and conversion
import requests   ## HTTP Requests 
import configparser   ## To read config files
import re      ## RegEx Module       
from urllib.parse import unquote   ## Encode and decode HTML Response 
import lxml.html  ## for getting text out of Html
import uuid  ## used for sending messages , to generate unique uuid 
import time
import signal
import os
import sys


class UCWALib:
    
    def __init__(self):
        config=configparser.ConfigParser()
        config.read('config.ini')
        self.sess = requests.Session()
        self.sess_post = requests.Session()
        #self.sess.trust_env=False
        
        ## Initialize global variables 
        self.domain=config['UCWALib']['domain']
        self.autodiscover_root=config['UCWALib']['autodiscover_root']
        self.login_url=config['UCWALib']['login_url']
        self.user_id=config['UCWALib']['user_id']
        self.user_password=config['UCWALib']['user_password']
        self.client_id=config['UCWALib']['client_id']
        self.tenant_id=config['UCWALib']['tenant_id']
        
        self.matchString = 'https?:\/\/(?:[^\/]+)|^(.*)$'
        
        ## Global variables
        
        self.username={}
        self.meTasks={}
        self.peopleTasks={}
        self.meetingTasks={}
        self.communicationTasks={}
        self.eventsURL={}
        self.authtoken =''
        self.hub_url=''

    def get_userurl(self):
        resp = requests.get(self.autodiscover_root+self.domain);
        if resp.status_code != 200:
            print('something wrong ');
        if 'user' not in resp.json()['_links'] :
            resp = requests.get(resp.json()['_links']['redirect']['href']);
            return resp.json()['_links']['user']['href'] ,resp.json()['_links']['xframe']['href'];
        else:
            return resp.json()['_links']['user']['href'] ,resp.json()['_links']['xframe']['href'];
        
    def get_token_adal(self,hub_url):
        
        ## Retrive the hub  address form the passed hub url 
        hub_address = re.search(self.matchString,hub_url).group(0)
        ##print("Derived Hub Address - ",str(hub_address))
        
        ## get Access token using tenant specific login URL 
        context = adal.AuthenticationContext(
            self.login_url+self.tenant_id, validate_authority=self.domain
            )
        
        token = context.acquire_token_with_username_password(
                    hub_address,
                    self.user_id,
                    self.user_password,
                    self.client_id    
                    )
        
        return 'Bearer '+token['accessToken']
    
    def authenticate_ucwa(self):
        
        ## get urls from user autodiscovery 
        user_url,user_xframe = self.get_userurl()
        
        ## get access token 
        user_token = self.get_token_adal(user_url)
        
        ##print("User Access token retrived ",user_token)
        
        ## Trying to get application url and hub
        header_val = { "Authorization" : user_token , 
           "Accept" : "application/json",
           "X-Requested-With": "XMLHttpRequest",
           "Referer": user_xframe,
           "Accept-Encoding" : "gzip, deflate",
           "User-Agent" : "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)",
           "Host" : self.domain,
           "Connection": "Keep-Alive"
            }
        
        result=requests.get(user_url, headers=header_val)
        ##print(result.json()['_links']['applications']['href'])
        
        ## We have not received redirect while fetching  application url , hence its not coded. if redirect exists , 
        ## get_userurl() method can be invoked to navigate via redirect an to reach to application link 
        ## Authenticate again for application URL and application hub
        
        app_hub_token = self.get_token_adal(result.json()['_links']['applications']['href'])
        ##print("Access token for Application Hub",app_hub_token)
        
        post_header_val = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": app_hub_token,
            "Accept-Language": "en-us",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)",
            ##"Host": "webpoolhkn0f03.infra.lync.com",  ## no need to pass host value but this is good to have
           "Connection": "Keep-Alive",
           "Cache-Control": "no-cache"
        }
        
        post_body_val={
              'UserAgent':'mytest agent1',
              'Culture':'en-US',
              'EndpointId':'xxxxxxxx-xxxx-8xxx-yxxx-xxxxxxxxxxxx'
        }
        
        ##Converting Dic to Json
        post_body_val=json.dumps(post_body_val)
        body_json = json.loads(post_body_val)
        
        ## Performing post on application url to get application resources
        post_result= requests.post(url=result.json()['_links']['applications']['href'],data=json.dumps(body_json), headers=post_header_val)
        
        ## Returning hub address 
        hub_address = re.search(self.matchString,result.json()['_links']['applications']['href']).group(0)
        
        status=self.makemeavaliable(hub_address,post_result.json()['_embedded']['me']['_links'],app_hub_token)
        print("Making Bot Avaliable ",status)

        ##Performing post on Application again after make me avaliable to get all resources 
        ## Performing post on application url to get application resources
        post_result= requests.post(url=result.json()['_links']['applications']['href'],data=json.dumps(body_json), headers=post_header_val)

        ## Returning hub address 
        hub_address = re.search(self.matchString,result.json()['_links']['applications']['href']).group(0)
        
        ## Setting Global varibales 
        self.username = post_result.json()['_embedded']['me']['name']
        self.meTasks=post_result.json()['_embedded']['me']['_links']
        self.peopleTasks=post_result.json()['_embedded']['people']['_links']
        self.meetingTasks=post_result.json()['_embedded']['onlineMeetings']['_links']
        self.communicationTasks=post_result.json()['_embedded']['communication']['_links']
        self.eventsURL=post_result.json()["_links"]["events"]["href"]
        self.reportmyActivity=hub_address+self.meTasks['reportMyActivity']['href']
        self.applicationURL= post_result.json()['_links']['self']['href']
        
        self.authtoken = app_hub_token
        self.hub_url= hub_address
        self.events_timeout = "&timeout=90"
        return "GOOD";
    
    def get_me(self):
        return self.username

    def terminate_application(self):
        res=requests.delete(url=self.hub_url+self.applicationURL, headers =self.get_post_headers())
        print("Result of terminating application",res)
    
    def get_post_headers(self):
        generic_post_headers={
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': self.authtoken
            }
        return generic_post_headers
    
    def get_get_headers(self):
        generic_get_headers={
             'Accept': "application/json",
            'Connection': "keep-alive",
            'Accept-Encoding':"gzip, deflate",
            'Authorization':self.authtoken
        }
        ## Setting requests session header values , for the first call 
        self.sess.headers.update({
             'Accept': "application/json",
            'Connection': "keep-alive",
            'Accept-Encoding':"gzip, deflate",
            'Authorization':self.authtoken
        })
        return generic_get_headers
    
    def makemeavaliable(self,hub_url,meTasks,app_hub_token):
        if 'makeMeAvailable' in meTasks:
            url=hub_url+meTasks['makeMeAvailable']['href']
            data = {'signInAs': 'Online',
                    'SupportedModalities': ['Messaging'],
                     'supportedMessageFormats' : ['Plain','Html']}
            header={
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': app_hub_token
                }
            res=requests.post(url=url,data=json.dumps(data),headers=header)
        else:
            return 'NA'
        return res.content

    def get_mypresence(self):
        url=self.hub_url+self.meTasks['presence']['href']
        header=self.get_get_headers()
        res=requests.get(url=url,headers=header)
        return res.json()['availability']

    def report_my_activity(self):
        ## Perform a post on report my activity to keep the connection alive.
        header=self.get_post_headers()
        res=requests.post(url=self.reportmyActivity,headers=header)
        print('Reported my Activity ',res)
        return res
    
    def set_mypresence(self,value):
        values = ['Away', 'BeRightBack', 'Busy', 'DoNotDisturb', 'Offwork', 'Online']
        
        if value in values:
            url=self.hub_url+self.meTasks['presence']['href']
            header=self.get_post_headers()
            data= {"availability" : value}
            res=requests.post(url=url,data=json.dumps(data),headers=header)
            print("Presence Updated ",res.content,res)
        else:
            raise KeyError("401 Invalid value")
            
    def set_note(self,value):
        url = self.hub_url+self.meTasks['note']['href']
        header = self.get_post_headers()
        data={"message":value}
        res=requests.post(url=url,data=json.dumps(data),headers=header)
        print("Note updated ",res.content,res)
        
    def get_note(self):
        url=self.hub_url+self.meTasks['note']['href']
        header = self.get_get_headers()
        res=requests.get(url=url,headers=header)
        return res.json()['message']
    
    def set_location(self,location):
        url = self.hub_url+self.meTasks['location']['href']
        header = self.get_post_headers()
        data={"location":location}
        res = requests.post(url=url,data=json.dumps(data),headers=header)
        print("Location Updated ",res)
        
    def get_location(self):
        url = self.hub_url+self.meTasks['location']['href']
        header=self.get_get_headers()
        res=requests.get(url,headers=header)
        return res.json()['location']

    def write_config(self,event):
        config = configparser.ConfigParser()
        if str(event)=='START':
           config['SKYPE'] = {'AUTHTOKEN': self.authtoken,
                                 'HUBURL': self.hub_url,
                                 'START_EVENTSURL': self.eventsURL.replace('%','%%')}
           print('Updating Config file with global varibales ')
        else:
           config['SKYPE'] = {'AUTHTOKEN': 'EXPIRED',
                                 'HUBURL': 'EXPIRED',
                                 'START_EVENTSURL': 'EXPIRED'}
           print('Updating Config file with Expired tokens ')
        with open('data/skype.ini', 'w') as configfile:
             config.write(configfile)

    def sigterm_handler(self,signal, frame):
        # save the state here or do whatever you want
        print('Terminating Skype Master handler')
        self.terminate_application()
        sys.exit(0)


def main():
    client = UCWALib();

    ## Initial config needs to be written to the file if the file does not exists 
    ## this is to ensure producers and consumers (Events Stream and send messages ) do not get stuck and are aware authentication is in progress
    client.write_config('BOOT')

    ret_status=client.authenticate_ucwa()

    my_status=client.get_mypresence()
    print('My current status',my_status)

    client.set_mypresence('Online')
    client.set_note("How can i help you today ?")

    note=client.get_note()
    print("Skype Note is ",note)

    client.set_location("Pune")
    location=client.get_location()
    print("Location =>",location)
    
    ## Setting keys in config to the work can begin 
    client.write_config('START')
    
    signal.signal(signal.SIGTERM, client.sigterm_handler)
   
    #try:
    while True:
       time.sleep(30)
       stat=client.report_my_activity()
     
       ## need to check if report my activity fails , this means the token has expired , following condition will reaquire the token
       if 204 != stat.status_code:
             print('need to reaquire token ')
             ## ___Future___ Code to re aquire token from refresh token needs to be called here, write_config  is called here to ensure producers and consumers know token has expired
             client.write_config('BOOT')
             ## Aquire token 
             ## future --- client.refresh_aad_token()
             ## reset config with new token value 
             client.write_config('START')
       else:
             print('Token valid ') 
    #except KeyboardInterrupt:
    #  print("************************************************* Kill Command received ***********************************************")
    #  print("***** 1> Closing UCWA Application  ")
    #  client.terminate_application()
      
    #finally:
    #  print("***** 2> Cleanup completed   ")

main()

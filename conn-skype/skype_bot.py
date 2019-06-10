from __main__ import aiohttp
import re
import adal
import json


class SkypeBot:

    def __init__(self):
        print("inside init ")
        self.user_url = None
        self.discover_url = None
        self.username = None
        self.password = None
        self.client_id = None
        self.tenant_id = None
        self.domain = None
        self.user_token = None
        self.app_token = None

        # Communication Variables
        self.meTasks = None
        self.peopleTasks = None
        self.meetingTasks = None
        self.communicationTasks = None
        self.eventsURL = None
        self.reportMyActivity = None
        self.applicationURL = None
        self.hub_address = None
        self.events_timeout = "&timeout=90"

        self.post_headers = None
        self.get_headers = None

        self.matchString = 'https?:\/\/(?:[^\/]+)|^(.*)$'
        self._session = aiohttp.ClientSession()

    async def close_session(self):
        await self._session.close()

    async def setup_ucwa(self, discover_url, username, password, client_id, tenant_id):
        print("__________________  Starting connection to UCWA  ___________________________")

        async with self._session.get(discover_url) as res:
            json_res = await res.json()

        if 'user' not in json_res['_links']:
            print("Got a redirect link ")
            async with self._session.get(json_res['_links']['redirect']['href']) as res:
                json_res = await res.json()
                self.user_url = json_res['_links']['user']['href']
        else:
            self.user_url = json_res['_links']['user']['href']

        self.discover_url = discover_url
        self.username = username
        self.password = password
        self.client_id = client_id
        self.tenant_id = tenant_id
        self.domain = self.username[self.username.index("@")+1:]

        await self.init_application()

        # Test Calls

        await self.report_my_activity()

        await self.set_my_presence('Online')
        result = await self.get_my_presence()
        print("Presence {}".format(result))

        await self.set_note("Welcome to Eva")
        result = await self.get_note()
        print("Note value {}".format(result))

        await self.set_location("Pune")
        result = await self.get_location()
        print("Location {}".format(result))

    async def get_adal_token(self, url):

        # get hub URL
        hub_address = re.search(self.matchString, url).group(0)

        # get Access token using tenant specific login URL
        context = adal.AuthenticationContext(
            'https://login.microsoftonline.com/' + self.tenant_id, validate_authority=self.domain
        )

        token = context.acquire_token_with_username_password(
            hub_address,
            self.username,
            self.password,
            self.client_id
        )
        return 'Bearer ' + token['accessToken']

    async def make_me_available(self, application_url, me_tasks):

        hub_address = re.search(self.matchString, application_url).group(0)

        if 'makeMeAvailable' in me_tasks:
            url = hub_address+me_tasks['makeMeAvailable']['href']
            data = {'signInAs': 'Online',
                    'SupportedModalities': ['Messaging'],
                    'supportedMessageFormats' : ['Plain', 'Html']}
            header={
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': self.app_token
                }
            async with self._session.post(url=url, data=json.dumps(data), headers=header) as res:
                print(res.status)
                json_res = res
                # TODO Need to check what is the status when the user is offline and handle accordingly
        else:
            return 'NA'
        return json_res

    async def init_application(self):

        # Step 1 - get Access token for User URL and perform a get on User URL , this gives us Application URL

        # Get User Access Token and get application resource via USER token

        self.user_token = await self.get_adal_token(self.user_url)
        print("User Token {}".format(self.user_token))

        header_val = { "Authorization" : self.user_token,
                       "Accept" : "application/json",
                       "X-Requested-With": "XMLHttpRequest",
                       #"Referer": user_xframe,
                       "Accept-Encoding" : "gzip, deflate",
                       "User-Agent" : "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)",
                       "Host": self.domain,
                       "Connection": "Keep-Alive"
                        }

        async with self._session.get(self.user_url, headers=header_val) as res:
            json_resp = await res.json()

        applications_url = json_resp['_links']['applications']['href']

        # Step 2 - From the applications URL Obtained , get a access token for the applications URL , and perform a POST on application
        # URL to get resources within that application Here we use Application token and obtain Skype Resources

        # Getting application token and authenticating to the application resource to get further resources
        self.app_token = await self.get_adal_token(applications_url)
        print(self.app_token)

        post_header_val = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": self.app_token,
            "Accept-Language": "en-us",
            "Accept-Encoding": "gzip, deflate",
            "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)",
            ##"Host": "webpoolhkn0f03.infra.lync.com",  ## no need to pass host value but this is good to have
            "Connection": "Keep-Alive",
            "Cache-Control": "no-cache"
        }

        # TODO User agent and Endpoint ID should be set Dynamically
        post_body_val = {
            'UserAgent': 'Eva Chatbot',
            'Culture': 'en-US',
            'EndpointId': 'xxxxxxxx-xxxx-8xxx-yxxx-xxxxxxxxxxxx'
        }

        async with self._session.post(applications_url, data=json.dumps(post_body_val), headers=post_header_val) as res:
            json_resp = await res.json()

        # Step 3 Initial Post on application URL would not give all endpoints , Hence we need to make the user available
        # and then post again on application URL to get all endpoints

        result = await self.make_me_available(applications_url, json_resp['_embedded']['me']['_links'])
        print("Making BOT Available {}".format(result))

        # Step 4 Performing POST on application resource again to get all Endpoints set.

        async with self._session.post(applications_url, data=json.dumps(post_body_val), headers=post_header_val) as res:
            json_resp = await res.json()

        # Finally all resources are available setting variables to there values

        self.meTasks = json_resp['_embedded']['me']['_links']
        self.peopleTasks = json_resp['_embedded']['people']['_links']
        self.meetingTasks = json_resp['_embedded']['onlineMeetings']['_links']
        self.communicationTasks = json_resp['_embedded']['communication']['_links']
        self.eventsURL = json_resp["_links"]["events"]["href"]
        self.reportMyActivity = self.meTasks['reportMyActivity']['href']
        self.applicationURL = json_resp['_links']['self']['href']
        self.hub_address = re.search(self.matchString, applications_url).group(0)

        # Setting generic Headers

        self.post_headers = {'Accept': 'application/json',
                             'Content-Type': 'application/json',
                             'Authorization': self.app_token
                             }

        self.get_headers = {'Accept': "application/json",
                            'Connection': "keep-alive",
                            'Accept-Encoding': "gzip, deflate",
                            'Authorization': self.app_token
                            }

        print("ApplicationURL var {}".format(self.applicationURL))
        print("Hub Address var {}".format(self.hub_address))

    async def terminate_application(self):

        async with self._session.delete(url=self.hub_address+self.applicationURL, headers=self.post_headers) as res:
            json_res = await res.status
        print("Terminating Application Status {}".format(json_res))

    async def report_my_activity(self):

        async with self._session.post(url=self.hub_address+self.reportMyActivity, headers=self.post_headers) as res:
            print("Reporting Activity Status {}".format(res.status))

    async def set_my_presence(self, value):

        values = ['Away', 'BeRightBack', 'Busy', 'DoNotDisturb', 'Offwork', 'Online']
        if value in values:
            data = {"availability": value}
            async with self._session.post(url=self.hub_address+self.meTasks['presence']['href'], data=json.dumps(data)) as res:
                print("Setting presence status {}".format(res.status))
            print(res.status)
        else:
            raise KeyError("401 Invalid value")

    async def get_my_presence(self):

        async with self._session.get(url=self.hub_address+self.meTasks['presence']['href'], headers=self.get_headers) as res:
            json_res = await res.json()
        return json_res['availability']

    async def set_note(self, value):

        data = {"message": value}
        async with self._session.post(url=self.hub_address+self.meTasks['note']['href'], data=json.dumps(data), headers=self.post_headers) as res:
            print("Setting Note status {}".format(res.status))

    async def get_note(self):

        async with self._session.get(url=self.hub_address+self.meTasks['note']['href'], headers=self.get_headers) as res:
            json_res = await res.json()

        return json_res['message']

    async def set_location(self, location):

        data = {"location": location}

        async with self._session.post(url=self.hub_address+self.meTasks['location']['href'], data=json.dumps(data), headers=self.post_headers) as res:
            print("Location updated status {}".format(res.status))

    async def get_location(self):
        async with self._session.get(url=self.hub_address+self.meTasks['location']['href'], headers=self.get_headers) as res:
            json_res = await res.json()
        return json_res['location']

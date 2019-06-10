from __main__ import aiohttp
import re
import msal


class SkypeBot:

    def __init__(self):
        print("inside init ")
        self.dummy = "Value"
        self.user_url = None
        self.discover_url = None
        self.username = None
        self.password = None
        self.client_id = None
        self._session = aiohttp.ClientSession()

    async def close_session(self):
        await self._session.close()

    async def setup_ucwa(self, discover_url, username, password, client_id):
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

        await self.authorise()

    async def authorise(self):

        print("Authenticating on the user URL ")

        async with self._session.get(self.user_url) as res:
            print(res)

        search_res = re.search('MsRtcOAuth href="(.*?)"', str(res))
        resource = search_res.group(1)
        #resource = resource.split("//")[-1].split("/")[0].split('?')[0]
        print("Resource {}".format(resource))

        search_auth_uri = re.search('authorization_uri="(.*?)"', str(res))
        auth_endpoint_url = search_auth_uri.group(1)
        print(auth_endpoint_url)

        app = msal.PublicClientApplication(client_id=self.client_id, authority="https://login.microsoftonline.com/navigateconsulting.in")

        result = app.acquire_token_by_username_password(username=self.username, password=self.password, scopes=["https://graph.microsoft.com/.default"])

        if "access_token" in result:
            print(result["access_token"])
            print(result["token_type"])
            print(result["expires_in"])  # You don't normally need to care about this.
            # It will be good for at least 5 minutes.
        else:
            print(result.get("error"))
            print(result.get("error_description"))
            print(result.get("correlation_id"))  # You may need this when reporting a bug
            if 65001 in result.get("error_codes", []):  # Not mean to be coded programatically, but...
                # AAD requires user consent for U/P flow
                print("Visit this to consent:", app.get_authorization_request_url(scope))

        header_val = {"Authorization" : "Bearer "+result["access_token"],
                      "Accept" : "application/json",
                      "X-Requested-With": "XMLHttpRequest"
                    }

        async with self._session.get(self.user_url,
                                     headers=header_val) as res:
            print(res)


import aiofiles
import json
from models import db, DomainsModel, IntentsModel, StoryModel, ResponseModel
import asyncio
import os
import shutil


# noinspection PyMethodMayBeStatic
class ExportProject:

    def __init__(self):
        self.DomainModel = DomainsModel()
        self.IntentsModel = IntentsModel()
        self.StoryModel = StoryModel()
        self.ResponseModel = ResponseModel()
        self.project_home = ''
        self.project_base_path = '../vol_chatbot_data/temp/trainer-sessions/'
        self.session_id = ''

    async def clean_up(self, sid):
        print("Cleaning up on session disconnect for session ID {}".format(sid))

        if os.path.isdir(self.project_base_path+sid):
            shutil.rmtree(self.project_base_path + sid)
        return 1

    async def main(self, sid, project_id):
        # Invoke Method to start parallel activity
        print("Starting export for project  ID {}".format(project_id))

        if os.path.isdir(self.project_base_path+sid):
            print("Directory already exists , Empty the directory")
            print("Working on project home {}".format(self.project_base_path + sid))
            self.session_id = sid
            self.project_home = self.project_base_path+self.session_id
            shutil.rmtree(self.project_base_path+sid)
            os.mkdir(self.project_home)

        else:
            print("Working on project home {}".format(self.project_base_path + sid))

            self.session_id = sid
            self.project_home = self.project_base_path + self.session_id
            os.mkdir(self.project_home)

        result = await self.start_export(project_id)
        print(result)

    async def start_export(self, project_id):
        domain_details = await self.DomainModel.get_domains(project_id)
        domains_list = []

        # make file and folder structures
        for domain in domain_details:
            domain_id = domain['_id']['$oid']
            domains_list.append([domain_id, domain['domain_name']])
            os.makedirs(self.project_home+'/skills/'+domain['domain_name']+'/data')

        # Starting export of each Domain in Parallel
        result = await asyncio.gather(*(self.write_domain_file(project_id, domain[0], domain[1]) for domain in domains_list))
        return result

    async def write_domain_file(self, project_id, domain_id, domain_name):
        print("writing domain File for id {} {}".format(domain_id, domain_name))

        # Starting with export for NLU , Stories and Domains files
        result = await asyncio.gather(self.export_nlu_data(project_id, domain_id, domain_name),
                                      self.export_domain_yml_data(project_id, domain_id, domain_name),
                                      self.export_stories(project_id, domain_id, domain_name))
        return result

    async def export_nlu_data(self, project_id, domain_id, domain_name):
        print("Exporting NLU Data {} {}".format(project_id, domain_id))

        intents_list = await self.IntentsModel.get_intents({"project_id": project_id, "domain_id": domain_id})
        base_nlu_stub = {"rasa_nlu_data": {"common_examples": []}}

        for intents in intents_list:
            intent_details = await self.IntentsModel.get_intent_details({'object_id': intents['_id']['$oid']})
            for intent in intent_details['text_entities']:
                json_record = {"text": intent['text'],
                               "intent": intents['intent_name'],
                               "entities": intent['entities']}
                base_nlu_stub['rasa_nlu_data']['common_examples'].append(json_record)

        async with aiofiles.open(self.project_home + '/skills/' + domain_name + '/data/nlu.json', "w") as out:
            await out.write(json.dumps(base_nlu_stub, indent=4, sort_keys=False))
            await out.flush()

    async def export_stories(self, project_id, domain_id, domain_name):
        stories_list = await self.StoryModel.get_stories({"project_id": project_id, "domain_id": domain_id})

        async with aiofiles.open(self.project_home+'/skills/'+domain_name+'/data/stories.md', "w") as out:
            print("Writing files ")
            for stories in stories_list:
                story_detail = await self.StoryModel.get_only_story_details({'object_id': stories['_id']['$oid']})
                await out.write("##"+stories['story_name']+"\n")
                for story_rec in story_detail['story']:
                    if story_rec['type'] == 'intent':
                        await out.write("* "+story_rec['key']+"\n")
                    else:
                        await out.write("  - "+story_rec['key']+"\n")

                await out.write("\n")
                await out.write("\n")
            await out.flush()

    async def export_domain_yml_data(self, project_id, domain_id, domain_name):
        print("Creating Domain.yml files for domain {} {}".format(project_id, domain_id))

        # Writing intents List, responses list and responses details  in Domains.yml

        intents_list = await self.IntentsModel.get_intents({"project_id": project_id, "domain_id": domain_id})

        async with aiofiles.open(self.project_home + '/skills/' + domain_name + '/domain.yml', "w") as out:
            await out.write("intents:"+"\n")
            for intents in intents_list:
                await out.write("- "+intents['intent_name']+"\n")
            await out.write("\n")
            await out.write("\n")

            response_list = await self.ResponseModel.get_responses({"project_id": project_id, "domain_id": domain_id})

            await out.write("actions:"+"\n")
            for resp in response_list:
                await out.write("- "+resp['response_name']+"\n")
            await out.write("\n")
            await out.write("\n")

            await out.write("templates:" + "\n")
            for response in response_list:
                await out.write("  "+response['response_name']+":\n")
                response_detail = await self.ResponseModel.get_response_details({"object_id": response['_id']['$oid']})
                for resp_value in response_detail['text_entities']:
                    await out.write("  - "+"text: "+f'"'+resp_value+f'"')
                    await out.write("\n")
                await out.write("\n")
            await out.write("\n")
            await out.flush()
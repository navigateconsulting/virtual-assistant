import aiofiles
import json
import yaml
from models import db, ProjectsModel, DomainsModel, IntentsModel, StoryModel, \
    ResponseModel, EntityModel, CustomActionsModel, ValidateData, IntentDetailModel, StoryDetailModel, ResponseDetailModel
import asyncio
import os
import shutil


# noinspection PyMethodMayBeStatic
class Export:

    def __init__(self):
        self.ProjectsModel = ProjectsModel()
        self.DomainModel = DomainsModel()
        self.IntentsModel = IntentsModel()
        self.IntentDetailModel = IntentDetailModel()
        self.StoryModel = StoryModel()
        self.StoryDetailModel = StoryDetailModel()
        self.ResponseModel = ResponseModel()
        self.ResponseDetailModel = ResponseDetailModel()
        self.EntityModel = EntityModel()
        self.CustomActionsModel = CustomActionsModel()
        self.ValidateData = ValidateData()
        self.project_home = ''
        #self.project_base_path = '../vol_chatbot_data/temp/trainer-sessions/'
        self.project_base_path = ''
        self.session_id = ''
        self.master_nlu = {"rasa_nlu_data": {"common_examples": []}}
        self.master_stories = ""
        self.master_domain_intents = ""
        self.master_domain_actions = ""
        self.master_domain_templates = ""
        self.master_domain_entities = ""

    async def reset_globals(self):
        self.master_nlu = {"rasa_nlu_data": {"common_examples": []}}
        self.master_stories = ""
        self.master_domain_intents = ""
        self.master_domain_actions = ""
        self.master_domain_templates = ""
        self.master_domain_entities = ""
        self.session_id = ""

    async def clean_up(self, sid):
        print("Cleaning up on session disconnect for session ID {}".format(sid))

        if os.path.isdir(self.project_base_path+sid):
            shutil.rmtree(self.project_base_path + sid)
        return 1

    def call_main(self, project_id):

        return asyncio.run(self.main(project_id))

    async def main(self, project_id):
        # Invoke Method to start parallel activity

        print("Starting export for project  ID {}".format(project_id))

        if not os.path.exists('/rasa_projects/'):
            os.makedirs('/rasa_projects/')
        self.project_base_path = '/rasa_projects/'
        self.project_home = self.project_base_path + project_id

        await self.reset_globals()

        if os.path.isdir(self.project_home):
            print("Directory already exists , Empty the directory")
            print("Working on project home {}".format(self.project_home))
            try:
                shutil.rmtree(self.project_home+'/data')
                shutil.rmtree(self.project_home + '/skills')
                os.remove(self.project_home + '/config.yml')
                os.remove(self.project_home + '/domain.yml')
            except FileNotFoundError:
                print("Folder already clear")
        else:
            print("Working on project home {}".format(self.project_home))

        if not os.path.exists(self.project_home):
            os.mkdir(self.project_home)
            os.mkdir(self.project_home + '/data')

        result = await self.start_export(project_id)
        print(result)

    async def start_export(self, project_id):
        project_details = self.ProjectsModel.get_project_details(project_id)
        print("Project Details Sent*********************", project_details)

        domain_details = self.DomainModel.get_all_domains(project_id)
        domains_list = []

        # Makefile file and folder structures
        for domain in domain_details:
            domain_id = domain['_id']['$oid']
            domains_list.append([domain_id, domain['domain_name']])

            # check for path for skills folder
            if not os.path.exists(self.project_home+'/skills/'+domain['domain_name']+'/data'):
                os.makedirs(self.project_home+'/skills/'+domain['domain_name']+'/data')

            # check for path for Data folder
            if not os.path.exists(self.project_home+'/data'):
                os.makedirs(self.project_home+'/data')

            result = await self.write_domain_file(project_id, domain_id, domain['domain_name'])

        # Starting export of each Domain in Parallel - This is disabled till multi skills is proven
        #result = await asyncio.gather(*(self.write_domain_file(project_id, domain[0], domain[1]) for domain in domains_list))

        # Write master consolidated NLU file to disk
        print("Writing Consolidated files to Disk")

        async with aiofiles.open(self.project_home + '/data/nlu.json', "w") as out:
            await out.write(json.dumps(self.master_nlu, indent=4, sort_keys=False))
            await out.flush()

        async with aiofiles.open(self.project_home + '/data/stories.md', "w") as out:
            await out.write(self.master_stories)
            await out.flush()

        async with aiofiles.open(self.project_home + '/domain.yml', "w") as out:
            await out.write("intents:"+"\n")
            await out.write(self.master_domain_intents + "\n" + "\n")

            await out.write("slots:"+"\n")
            await out.write(self.master_domain_entities + "\n" + "\n")

            await out.write("actions:"+"\n")
            await out.write(self.master_domain_actions + "\n" + "\n")

            await out.write("templates:" + "\n")
            await out.write(self.master_domain_templates + "\n" + "\n")

            await out.flush()

        print("Writing Default config file to Disk")

        async with aiofiles.open(self.project_home + '/config.yml', "w") as out:

            await out.write("# Configuration for Rasa NLU & Core." + "\n\n")
            print(yaml.dump(yaml.load(json.dumps(project_details['configuration'])), default_flow_style=False) + "\n")
            await out.write(yaml.dump(yaml.load(json.dumps(project_details['configuration'])), default_flow_style=False) + "\n")
            await out.flush()

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

        intents_list = self.IntentsModel.get_intents(project_id, domain_id)
        base_nlu_stub = {"rasa_nlu_data": {"common_examples": []}}

        for intents in intents_list:
            intent_details = self.IntentDetailModel.get_intent_details(intents['_id']['$oid'])
            for intent in intent_details['text_entities']:
                json_record = {"text": intent['text'],
                               "intent": intents['intent_name'],
                               "entities": intent['entities']}
                base_nlu_stub['rasa_nlu_data']['common_examples'].append(json_record)
                self.master_nlu['rasa_nlu_data']['common_examples'].append(json_record)

        async with aiofiles.open(self.project_home + '/skills/' + domain_name + '/data/nlu.json', "w") as out:
            await out.write(json.dumps(base_nlu_stub, indent=4, sort_keys=False))
            await out.flush()

    async def export_stories(self, project_id, domain_id, domain_name):
        stories_list = self.StoryModel.get_stories(project_id, domain_id)

        async with aiofiles.open(self.project_home+'/skills/'+domain_name+'/data/stories.md', "w") as out:
            print("Writing files ")
            entity_list = None
            for stories in stories_list:
                story_detail = self.StoryDetailModel.get_story_details(stories['_id']['$oid'])
                await out.write("##"+stories['story_name']+"\n")
                self.master_stories = self.master_stories + "##"+stories['story_name']+"\n"
                for story_rec in story_detail['story']:
                    if story_rec['type'] == 'intent':
                        await out.write("* "+story_rec['key']+"\n")
                        for entities in story_rec['entities']:
                            entity_list = f'"'+entities['entity_name']+f'"'+":"+f'"'+entities['entity_value']+f'"' + ","
                            print("Entity value ".format(entities['entity_name']))
                        if entity_list is None:
                            self.master_stories = self.master_stories + "* "+story_rec['key']+"\n"
                        else:
                            self.master_stories = self.master_stories + "* " + story_rec['key'] + "{" + entity_list[:-1] + "}" + "\n"
                    else:
                        await out.write("  - "+story_rec['key']+"\n")
                        self.master_stories = self.master_stories + "  - "+story_rec['key']+"\n"

                await out.write("\n")
                await out.write("\n")
                self.master_stories = self.master_stories + "\n"+"\n"
            await out.flush()

    async def export_domain_yml_data(self, project_id, domain_id, domain_name):
        print("Creating Domain.yml files for domain {} {}".format(project_id, domain_id))

        # Writing intents List, responses list and responses details  in Domains.yml

        intents_list = self.IntentsModel.get_intents(project_id, domain_id)

        async with aiofiles.open(self.project_home + '/skills/' + domain_name + '/domain.yml', "w") as out:
            await out.write("intents:"+"\n")
            for intents in intents_list:
                await out.write("- "+intents['intent_name']+"\n")
                self.master_domain_intents = self.master_domain_intents + "- "+intents['intent_name']+"\n"
            await out.write("\n")
            await out.write("\n")

            slots_list = self.EntityModel.get_entities(project_id)

            for slots in slots_list:
                if slots['entity_name'] not in self.master_domain_entities:
                    self.master_domain_entities = self.master_domain_entities+"  "+slots['entity_name']+":"+"\n"
                    self.master_domain_entities = self.master_domain_entities+"    "+"type: "+slots['entity_slot']['type']+"\n"
                else:
                    print("Entity Already exists ")

            response_list = self.ResponseModel.get_responses(project_id, domain_id)

            await out.write("actions:"+"\n")
            for resp in response_list:
                await out.write("- "+resp['response_name']+"\n")
                self.master_domain_actions = self.master_domain_actions + "- "+resp['response_name']+"\n"

            # Import custom actions from Actions collection

            default_actions = ['action_listen',
                               'action_restart',
                               'action_default_fallback',
                               'action_deactivate_form',
                               'action_revert_fallback_events',
                               'action_default_ask_rephrase',
                               'action_back']

            custom_actions = self.CustomActionsModel.get_all_custom_actions()

            for record in custom_actions:
                if record['action_name'] not in default_actions:
                    await out.write("- "+record['action_name']+"\n")
                    if record['action_name'] not in self.master_domain_actions:
                        self.master_domain_actions = self.master_domain_actions + "- " + record['action_name'] + "\n"

            await out.write("\n")
            await out.write("\n")

            await out.write("templates:" + "\n")
            for response in response_list:
                await out.write("  "+response['response_name']+":\n")
                self.master_domain_templates = self.master_domain_templates + "  "+response['response_name']+":\n"
                response_detail = self.ResponseDetailModel.get_response_details(response['_id']['$oid'])
                for resp_value in response_detail['text_entities']:
                    await out.write("  - "+"text: "+f'"'+resp_value+f'"')
                    await out.write("\n")
                    self.master_domain_templates = self.master_domain_templates + "  - "+"text: "+f'"'+resp_value+f'"'+"\n"
                await out.write("\n")
            await out.write("\n")
            await out.flush()

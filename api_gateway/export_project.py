import aiofiles
import json
from models import db, DomainsModel, IntentsModel, StoryModel, ResponseModel, EntityModel, CustomActionsModel, ValidateData
import asyncio
import os
import shutil
from config import CONFIG

# TODO Do files need to be split by domain ? or combine them under common files after checking if domain is to be exported or not


# noinspection PyMethodMayBeStatic
class ExportProject:

    def __init__(self):
        self.DomainModel = DomainsModel()
        self.IntentsModel = IntentsModel()
        self.StoryModel = StoryModel()
        self.ResponseModel = ResponseModel()
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

    async def reset_globals(self, sid):
        self.master_nlu = {"rasa_nlu_data": {"common_examples": []}}
        self.master_stories = ""
        self.master_domain_intents = ""
        self.master_domain_actions = ""
        self.master_domain_templates = ""
        self.master_domain_entities = ""
        self.session_id = sid

    async def clean_up(self, sid):
        print("Cleaning up on session disconnect for session ID {}".format(sid))

        if os.path.isdir(self.project_base_path+sid):
            shutil.rmtree(self.project_base_path + sid)
        return 1

    async def validate_project(self, project_id):

        # Check 1
        # Project should have atleast 1 Intent Response Entity and Story defined.
        result = await self.ValidateData.validate_data(project_id)
        return result

    async def main(self, sid, project_id, model_path):
        # Invoke Method to start parallel activity

        print("Validating the project data for any issues for project ID {}".format(project_id))

        result = await self.validate_project(project_id)

        if result is not '':
            return result
        print("Starting export for project  ID {}".format(project_id))

        if model_path == 'SESSION':
            self.project_base_path = CONFIG.get('api_gateway', 'SESSION_MODEL_PATH')
            self.project_home = self.project_base_path + sid

        else:
            self.project_base_path = CONFIG.get('api_gateway', 'DEPLOY_MODEL_PATH')
            self.project_home = self.project_base_path + project_id

        await self.reset_globals(sid)

        if os.path.isdir(self.project_base_path+sid):
            print("Directory already exists , Empty the directory")
            print("Working on project home {}".format(self.project_base_path + sid))
            shutil.rmtree(self.project_base_path+sid)

        else:
            print("Working on project home {}".format(self.project_base_path + sid))

        if not os.path.exists(self.project_home):
            os.mkdir(self.project_home)
            os.mkdir(self.project_home + '/data')

        result = await self.start_export(project_id)
        print(result)

    async def start_export(self, project_id):
        domain_details = await self.DomainModel.get_domains(project_id)
        domains_list = []

        # make file and folder structures
        for domain in domain_details:
            domain_id = domain['_id']['$oid']
            domains_list.append([domain_id, domain['domain_name']])
            if not os.path.exists(self.project_home+'/skills/'+domain['domain_name']+'/data'):
                os.makedirs(self.project_home+'/skills/'+domain['domain_name']+'/data')
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

            await out.write("# Configuration for Rasa NLU." + "\n\n")
            await out.write("language: en" + "\n")
            await out.write("pipeline: supervised_embeddings" + "\n")

            await out.write("# Configuration for Rasa Core." + "\n\n")
            await out.write("policies:" + "\n")
            await out.write("  - name: KerasPolicy" + "\n")
            await out.write("    epochs: 150" + "\n")
            await out.write("    max_history: 4" + "\n")
            await out.write("  - name: MemoizationPolicy" + "\n")
            await out.write("  - name: TwoStageFallbackPolicy" + "\n")
            await out.write("    nlu_threshold: 0.3" + "\n")
            await out.write("    core_threshold: 0.3" + "\n")
            await out.write("    fallback_core_action_name: ""action_default_fallback""" + "\n")
            await out.write("    fallback_nlu_action_name: ""action_default_fallback""" + "\n")
            await out.write("    deny_suggestion_intent_name: ""negative""" + "\n")
            await out.write("  - name: MappingPolicy" + "\n")
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

        intents_list = await self.IntentsModel.get_intents({"project_id": project_id, "domain_id": domain_id})
        base_nlu_stub = {"rasa_nlu_data": {"common_examples": []}}

        for intents in intents_list:
            intent_details = await self.IntentsModel.get_intent_details({'object_id': intents['_id']['$oid']})
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
        stories_list = await self.StoryModel.get_stories({"project_id": project_id, "domain_id": domain_id})

        async with aiofiles.open(self.project_home+'/skills/'+domain_name+'/data/stories.md', "w") as out:
            print("Writing files ")
            entity_list = None
            for stories in stories_list:
                story_detail = await self.StoryModel.get_only_story_details({'object_id': stories['_id']['$oid']})
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

        intents_list = await self.IntentsModel.get_intents({"project_id": project_id, "domain_id": domain_id})

        async with aiofiles.open(self.project_home + '/skills/' + domain_name + '/domain.yml', "w") as out:
            await out.write("intents:"+"\n")
            for intents in intents_list:
                await out.write("- "+intents['intent_name']+"\n")
                self.master_domain_intents = self.master_domain_intents + "- "+intents['intent_name']+"\n"
            await out.write("\n")
            await out.write("\n")

            slots_list = await self.EntityModel.get_entities({"project_id": project_id})

            for slots in slots_list:
                if slots['entity_name'] not in self.master_domain_entities:
                    self.master_domain_entities = self.master_domain_entities+"  "+slots['entity_name']+":"+"\n"
                    self.master_domain_entities = self.master_domain_entities+"    "+"type: "+slots['entity_slot']['type']+"\n"
                else:
                    print("Entity Already exists ")

            response_list = await self.ResponseModel.get_responses({"project_id": project_id, "domain_id": domain_id})

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
                               'action_default_ask_affirmation',
                               'action_default_ask_rephrase',
                               'action_back']

            custom_actions = await self.CustomActionsModel.get_custom_actions()

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
                response_detail = await self.ResponseModel.get_response_details({"object_id": response['_id']['$oid']})
                for resp_value in response_detail['text_entities']:
                    await out.write("  - "+"text: "+f'"'+resp_value+f'"')
                    await out.write("\n")
                    self.master_domain_templates = self.master_domain_templates + "  - "+"text: "+f'"'+resp_value+f'"'+"\n"
                await out.write("\n")
            await out.write("\n")
            await out.flush()

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { EntitiesDataService } from '../common/services/entities-data.service';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Story } from '../common/models/story';
import { Intent } from '../common/models/intent';
import { Response } from '../common/models/response';
import { Entity } from '../common/models/entity';
import { IntentResponse } from '../common/models/intent_response';
import { MatDialog } from '@angular/material/dialog';
import { AddEntityValueComponent } from '../common/modals/add-entity-value/add-entity-value.component';
import { WebSocketService } from '../common/services/web-socket.service';
import { SharedDataService } from '../common/services/shared-data.service';
import { constant } from '../../environments/constants';
import { environment } from '../../environments/environment';

declare var adjustScroll: Function;

@Component({
  selector: 'app-manage-stories',
  templateUrl: './manage-stories.component.html',
  styleUrls: ['./manage-stories.component.scss']
})
export class ManageStoriesComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  story: Story;
  storyForm: FormGroup;

  intents: any;
  intents_text_arr: any;
  intentsfilteredOptions: Observable<string[]>;
  intentControl = new FormControl();

  responses: any;
  responses_text_arr: any;
  responsesfilteredOptions: Observable<string[]>;
  responseControl = new FormControl();

  entities: any;
  entities_text_arr: any;
  entitiesfilteredOptions: Observable<string[]>;
  entityControl = new FormControl();

  actions: any;

  intent_response_entity_arr = new Array<object[]>();

  intents_responses: any;
  intents_responses_backup: any;

  intents_entities_responses: any;

  removable = true;
  selectable = true;

  disable_response = false;
  show_intent_error = false;
  show_ir_error: boolean;
  on_intent_response_entity: boolean;

  currentStory: any;
  appSource: string;
  @Input() projectObjectId: string;
  @Input() domainObjectId: string;
  @Input() storyObjectId: string;

  @Output() saveStoryJSON = new EventEmitter<{ story_index: number, intents_responses: [{}] }>();

  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private webSocketService: WebSocketService,
              private entities_service: EntitiesDataService,
              public sharedDataService: SharedDataService) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    const intents_responses: FormArray = new FormArray([]);

    this.storyForm = this.fb.group({
      intents_responses: intents_responses
    });

    this.getEntities();

    this.getStory();

    this.getActions();

    this.getIntents();

    this.getResponses();

    this.show_ir_error = false;
    this.on_intent_response_entity = false;

    this.sharedDataService.setSharedData('activeTabIndex', '2', constant.MODULE_COMMON);
  }

  getStory() {
    this.webSocketService.createStoryRoom('story_' + this.storyObjectId);
    // tslint:disable-next-line: max-line-length
    this.webSocketService.getStoryDetails({object_id: this.storyObjectId, project_id: this.projectObjectId, domain_id: this.domainObjectId}, 'story_' + this.storyObjectId).subscribe(story_details => {
      this.currentStory = story_details;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.subscription.add(this.webSocketService.getStoryDetailAlerts().subscribe(response => {
      console.log(response);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification')));
  }

  getActions() {
    this.webSocketService.getActionsForStory().subscribe(actions => {
      this.actions = actions;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  getIntents() {
    this.webSocketService.getIntentsForStory().subscribe(intents => {
      this.intents = intents;
      this.convertToIntentTextArray();
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  convertToIntentTextArray() {
    const intents_text_arr = new Array<object>();
    this.intents.forEach(function (intent) {
      if (intent.text_entities !== undefined) {
        const intent_text_entities = intent.text_entities;
        for (let i = 0; i < intent_text_entities.length; i++) {
          // tslint:disable-next-line: max-line-length
          intents_text_arr.push({'intent_id': intent._id.$oid, 'intent_name': intent.intent_name, 'intent_text': intent_text_entities[i].text});
        }
      }
    });
    this.intents_text_arr = intents_text_arr;
  }

  getResponses() {
    this.webSocketService.getResponsesForStory().subscribe(responses => {
      this.responses = responses;
      this.convertToResponseTextArray();
      if (this.currentStory !== undefined) {
        if (this.currentStory.story.length > 0) {
          this.story = new Story;
          this.story.story_name = this.currentStory.story_name;
          this.story.story = this.currentStory.story;
          this.initForm(this.story); // handles both the create and edit logic
        } else {
          this.initForm(); // handles both the create and edit logic
        }
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  convertToResponseTextArray() {
    const responses_text_arr = new Array<object>();
    this.responses.forEach(function (response) {
      if (response.text_entities !== undefined) {
        const response_text_entities = response.text_entities;
        for (let i = 0; i < response_text_entities.length; i++) {
          // tslint:disable-next-line:max-line-length
          responses_text_arr.push({'response_id': response._id.$oid, 'response_name': response.response_name, 'response_text': response_text_entities[i]});
        }
      }
    });
    if (this.actions !== undefined) {
      this.actions.forEach(function (action) {
        if (action !== undefined) {
          // tslint:disable-next-line: max-line-length
          responses_text_arr.push({'response_id': action._id.$oid, 'response_name': action.action_name, 'response_text': action.action_description});
        }
      });
    }
    this.responses_text_arr = responses_text_arr;
  }

  getEntities() {
    this.entities_service.createEntitiesRoom();
    this.entities_service.getEntities({project_id: this.projectObjectId}).subscribe(entities => {
      this.entities = entities;
      this.convertToEntityTextArray();
      this.entityControl = new FormControl('', requireEntityMatch(this.entities));
      this.entitiesfilteredOptions = this.entityControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter_entities(value))
      );
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  convertToEntityTextArray() {
    const entities_text_arr = new Array<object>();
    this.entities.forEach(function (entity) {
      if (entity.entity_slot.type === 'categorical') {
        const entities_values = entity.entity_slot.values;
        for (let i = 0; i < entities_values.length; i++) {
          // tslint:disable-next-line:max-line-length
          entities_text_arr.push({'entity_name': entity.entity_name, 'entity_value': entities_values[i]});
        }
      } else {
        entities_text_arr.push({'entity_name': entity.entity_name, 'entity_value': ''});
      }
    });
    this.entities_text_arr = entities_text_arr;
  }

  /**
   * Initialises the tripForm
   * @method initForm
   */

  initForm(story?: Story): void {
    const intents_responses: FormArray = new FormArray([]);

    this.storyForm = this.fb.group({
      intents_responses: intents_responses
    });
    if (!story) {
      // Creating a new story
      this.addIntentToStory();
      // this.addResponseToStory();
    } else {
      // Editing a story
      story.story.forEach((intent_response, intentresponseIndex) => {
        if (intent_response.type === 'intent') {
          this.addIntentToStory(intent_response);
          if (this.intent_response_entity_arr[intentresponseIndex] === undefined) {
            this.intent_response_entity_arr[intentresponseIndex] = new Array<object>();
          }
          this.intent_response_entity_arr[intentresponseIndex] = intent_response.entities;
        } else if (intent_response.type === 'response') {
          this.addResponseToStory(intent_response);
          if (this.intent_response_entity_arr[intentresponseIndex] === undefined) {
            this.intent_response_entity_arr[intentresponseIndex] = new Array<object>();
          }
          const entities = [];
          const s = intent_response.value;
          const arrStr = s.split(/[{}]/);
          for (let i = 0; i < arrStr.length; i++) {
            if (/\s/.test(arrStr[i]) === false && arrStr[i].trim() !== '') {
              entities.push(arrStr[i]);
            }
          }
          this.intent_response_entity_arr[intentresponseIndex] = entities;
        }
      });
    }
  }

  displayIntentWith(intent?: Intent): string | undefined {
    return intent ? intent.intent_text : undefined;
  }

  displayResponseWith(response?: Response): string | undefined {
    return response ? response.response_text : undefined;
  }

  displayEntityWith(entity?: Entity): string | undefined {
    return entity ? entity.entity_name : undefined;
  }

  private _filter_intents(intent: string): string[] {
    const filterValue = intent.toLowerCase();
    return this.intents_text_arr.filter(option => option.intent_text.toLowerCase().includes(filterValue));
  }

  private _filter_entities(entity: string): string[] {
    const filterValue = entity.toLowerCase();
    return this.entities_text_arr.filter(option => option.entity_name.toLowerCase().includes(filterValue));
  }

  private _filter_responses(response: string): string[] {
    const filterValue = response.toLowerCase();
    return this.responses_text_arr.filter(option => option.response_text.toLowerCase().includes(filterValue));
  }

  /**
   * Adds an intent FormGroup to the intents <FormArray>FormControl(__intents__)
   * @method addCity
   * @param void
   * @return void
   */

  addIntentToStory(intent_response?: IntentResponse): void {
    const intent_key = intent_response ? intent_response.key : '';
    const intent_value = intent_response ? intent_response.value : '';
    const type = intent_response ? intent_response.type : 'intent';
    (<FormArray>this.storyForm.controls['intents_responses']).push(
      new FormGroup({
        key: new FormControl(intent_key, Validators.required),
        value: new FormControl(intent_value, Validators.required),
        type: new FormControl(type),
      })
    );
    if ((<FormArray>this.storyForm.controls['intents_responses']).length > 0) {
      this.disable_response = false;
    }
    const intent_length = (<FormArray>this.storyForm.controls['intents_responses']).length;
    const intentControl = (<FormArray>this.storyForm.controls['intents_responses']).at(intent_length - 1);
    intentControl['controls'].value.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value[0].text),
      map(text => text ? this._filter_intents(text.toString()) : this.intents_text_arr.slice())
    ).subscribe(filteredIntentResult => { this.intentsfilteredOptions = filteredIntentResult; });
    adjustScroll();
  }

  addResponseToStory(intent_response?: IntentResponse): void {
    const response_key = intent_response ? intent_response.key : '';
    const response_value = intent_response ? intent_response.value : '';
    const type = intent_response ? intent_response.type : 'response';
    (<FormArray>this.storyForm.controls['intents_responses']).push(
      new FormGroup({
        key: new FormControl(response_key, Validators.required),
        value: new FormControl(response_value, Validators.required),
        type: new FormControl(type),
      })
    );
    const response_length = (<FormArray>this.storyForm.controls['intents_responses']).length;
    const responseControl = (<FormArray>this.storyForm.controls['intents_responses']).at(response_length - 1);
    responseControl['controls'].value.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value[0].text),
      map(text => text ? this._filter_responses(text.toString()) : this.responses_text_arr.slice())
    ).subscribe(filteredResponseResult => { this.responsesfilteredOptions = filteredResponseResult; });
    adjustScroll();
  }

  addIntentResponseDetailsToStory(type: string, intent_response_insert_index?: number) {
    let show_ir_error = false;
    this.storyForm.value.intents_responses.forEach(function (intent_response) {
      if (intent_response.value.trim() === '') {
        show_ir_error = true;
      }
    });
    this.show_ir_error = show_ir_error;
    if (this.show_ir_error) {
      setTimeout(() => {
        this.show_ir_error = false;
      }, 2000);
    } else {
      // tslint:disable-next-line: max-line-length
      const ir_insert_index = intent_response_insert_index ? intent_response_insert_index : (<FormArray>this.storyForm.controls['intents_responses']).length;
      const insert_ir_to_story = {
        project_id: this.projectObjectId,
        domain_id: this.domainObjectId,
        object_id: this.storyObjectId,
        position: ir_insert_index,
        story: [{
          key: '',
          value: '',
          type: type,
          entities: []
        }]
      };
      this.webSocketService.insertDetailsToStory(insert_ir_to_story, 'story_' + this.storyObjectId);
    }
  }

  removeIntentResponseFromStory(intent_response_index: number, intent_response: any, entities?: any) {
    const delete_ir_to_story = {
      project_id: this.projectObjectId,
      domain_id: this.domainObjectId,
      object_id: this.storyObjectId,
      doc_index: intent_response_index,
      story: [{
        key: intent_response.value.key,
        value: intent_response.value.value,
        type: intent_response.value.type,
        entities: entities ? entities : []
      }]
    };
    this.webSocketService.deleteDetailsFromStory(delete_ir_to_story, 'story_' + this.storyObjectId);
    adjustScroll();
  }

  // tslint:disable-next-line: max-line-length
  onIntentResponseEntityChange(event: any, intent_response_index: number, intent_name: string, intent_text: string, type: string, entities?: any) {
    const update_ir_in_story = {
      project_id: this.projectObjectId,
      domain_id: this.domainObjectId,
      object_id: this.storyObjectId,
      doc_index: intent_response_index,
      story: {
        key: intent_name,
        value: intent_text,
        type: type,
        entities: entities ? entities : []
      }
    };
    this.webSocketService.updateDetailsFromStory(update_ir_in_story, 'story_' + this.storyObjectId);
    this.on_intent_response_entity = true;
  }

  validateIntentInput(intent_index: number, event: any) {
    if (this.on_intent_response_entity === false) {
      const intentControl = (<FormArray>this.storyForm.controls['intents_responses']).at(intent_index);
      const validate_intent = this.intents_text_arr.filter(value => (value.intent_text === intentControl.value.value))[0];
      if (validate_intent !== undefined) {
        intentControl.value.key = validate_intent.intent_name;
        intentControl.value.value = validate_intent.intent_text;
        intentControl.value.type = 'intent';
        this.onIntentResponseEntityChange(event, intent_index, intentControl.value.key, intentControl.value.value, 'intent');
      } else {
        event.srcElement.value = '';
        intentControl.value.key = '';
        intentControl.value.value = '';
        intentControl.value.type = 'intent';
        intentControl['controls'].value.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value[0].text),
          map(text => text ? this._filter_intents(text.toString()) : this.intents_text_arr.slice())
        ).subscribe(filteredIntentResult => { this.intentsfilteredOptions = filteredIntentResult; });
      }
    } else {
      this.on_intent_response_entity = false;
    }
  }

  validateResponseInput(response_index: number, event: any) {
    if (this.on_intent_response_entity === false) {
      const responseControl = (<FormArray>this.storyForm.controls['intents_responses']).at(response_index);
      const validate_response = this.responses_text_arr.filter(value => value.response_text === responseControl.value.value)[0];
      if (validate_response !== undefined) {
        responseControl.value.key = validate_response.response_name;
        responseControl.value.value = validate_response.response_text;
        responseControl.value.type = 'response';
        this.onIntentResponseEntityChange(event, response_index, responseControl.value.key, responseControl.value.value, 'response');
      } else {
        event.srcElement.value = '';
        responseControl.value.key = '';
        responseControl.value.value = '';
        responseControl.value.type = 'response';
        responseControl['controls'].value.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value[0].text),
          map(text => text ? this._filter_responses(text.toString()) : this.responses_text_arr.slice())
        ).subscribe(filteredResponseResult => { this.responsesfilteredOptions = filteredResponseResult; });
      }
    }
  }

  onEntityChange(event: any, intent_response_index: number, intent_response: any) {
    if (event.type === 'mousedown') {
      const entity_name_value = event.srcElement.innerText.split(':');
      if (entity_name_value[1] === '') {
        const dialogRef = this.dialog.open(AddEntityValueComponent);
        dialogRef.afterClosed().subscribe(res => {
          if (res) {
            entity_name_value[1] = res;
            // tslint:disable-next-line: max-line-length
            this.intent_response_entity_arr[intent_response_index].push({'entity_name': entity_name_value[0], 'entity_value': entity_name_value[1]});
            // tslint:disable-next-line: max-line-length
            this.onIntentResponseEntityChange(event, intent_response_index, intent_response.value.key, intent_response.value.value, intent_response.value.type, this.intent_response_entity_arr[intent_response_index]);
          }
        });
      } else {
        // tslint:disable-next-line: max-line-length
        this.intent_response_entity_arr[intent_response_index].push({'entity_name': entity_name_value[0], 'entity_value': entity_name_value[1]});
        // tslint:disable-next-line: max-line-length
        this.onIntentResponseEntityChange(event, intent_response_index, intent_response.value.key, intent_response.value.value, intent_response.value.type, this.intent_response_entity_arr[intent_response_index]);
      }
    }
  }

  // tslint:disable-next-line: max-line-length
  removeEntityFromIntentResponse(intent_response: any, intent_response_index: number, intent_response_entity_arr: any, entity_index: number) {
    intent_response_entity_arr.splice(entity_index, 1);
    // tslint:disable-next-line: max-line-length
    this.onIntentResponseEntityChange(true, intent_response_index, intent_response.value.key, intent_response.value.value, intent_response.value.type, intent_response_entity_arr);
  }

  handleSpacebar(event: any) {
    if (event.keyCode === 32 || event.keyCode === 13) {
      event.stopPropagation();
    }
  }

  collapse_close(type: string, index: number) {
    // collapseClose(type, index);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    for (let i = 0; i < this.currentStory['story'].length; i++) {
      if (this.currentStory['story'][i]['key'] === '') {
        this.removeIntentResponseFromStory(i, this.currentStory['story'][i]);
      }
    }
    this.currentStory = undefined;
    this.dialog.closeAll();
  }
}

function requireIntentMatch(intents: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (intents.find(value => value.intent_text.includes(control.value)) === undefined) {
      return { 'invalid': true };
    }
    return null;
  };
}

function requireResponseMatch(responses: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (responses.find(value => value.response_text.includes(control.value)) === undefined) {
        return { 'invalid': true };
    }
    return null;
  };
}

function requireEntityMatch(entities: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (entities.find(value => value.entity_name.includes(control.value)) === undefined) {
        return { 'invalid': true };
    }
    return null;
  };
}

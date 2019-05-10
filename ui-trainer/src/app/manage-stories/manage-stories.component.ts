import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { IntentsDataService } from '../common/services/intents-data.service';
import { ResponsesDataService } from '../common/services/responses-data.service';
import { EntitiesDataService } from '../common/services/entities-data.service';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Story } from '../common/models/story';
import { Intent } from '../common/models/intent';
import { Response } from '../common/models/response';
import { Entity } from '../common/models/entity';
import { IntentResponse } from '../common/models/intent_response';
import { MatDialog } from '@angular/material/dialog';
import { AddEntityValueComponent } from '../common/modals/add-entity-value/add-entity-value.component';
import { MatSnackBar } from '@angular/material';

declare var collapseClose: Function;
declare var adjustScroll: Function;

@Component({
  selector: 'app-manage-stories',
  templateUrl: './manage-stories.component.html',
  styleUrls: ['./manage-stories.component.scss']
})
export class ManageStoriesComponent implements OnInit {

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

  intent_response_entity_arr = new Array<object[]>();

  intents_responses: any;
  intents_responses_backup: any;

  intents_entities_responses: any;

  removable = true;
  selectable = true;

  disable_response = false;
  show_intent_error = false;

  @Input() currentStory: any;

  @Output() saveStoryJSON = new EventEmitter<{ story_index: number, intents_responses: [{}] }>();

  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private intents_data: IntentsDataService,
              private responses_data: ResponsesDataService,
              private entities_data: EntitiesDataService) { }

  ngOnInit() {
    this.getIntents();
    this.convertToIntentTextArray();

    this.getEntities();

    this.getResponse();
    this.convertToResponseTextArray();

    if (this.currentStory.intents_responses.length > 0) {
      this.story = new Story;
      this.story.story_name = this.currentStory.story;
      this.story.intents_responses = this.currentStory.intents_responses;
      this.initForm(this.story); // handles both the create and edit logic
    } else {
      this.initForm(); // handles both the create and edit logic
    }
  }

  /**
   * Sends update and create method requests to the api
   * @method onSubmit
   */
  onSubmit() {
    if ( this.storyForm.valid ) {
      this.intents_entities_responses = this.storyForm.value['intents_responses'];
      this.intents_entities_responses.forEach((intent_response, intentresponseIndex) => {
        this.intents_entities_responses[intentresponseIndex]['entities'] = this.intent_response_entity_arr[intentresponseIndex];
      });
      this.saveStoryJSON.emit({ story_index: this.currentStory.story_id, intents_responses: this.intents_entities_responses });
      this.snackBar.open('Story Saved Successfully', 'Close', {
        duration: 5000,
      });
    }
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
      this.addResponseToStory();
    } else {
      // Editing a story
      story.intents_responses.forEach((intent_response, intentresponseIndex) => {
        if (intent_response.type === 'Intent') {
          this.addIntentToStory(intent_response);
        } else if (intent_response.type === 'Response') {
          this.addResponseToStory(intent_response);
        }
        if (this.intent_response_entity_arr[intentresponseIndex] === undefined) {
          this.intent_response_entity_arr[intentresponseIndex] = new Array<object>();
        }
        this.intent_response_entity_arr[intentresponseIndex] = intent_response.entities;
      });
    }
  }

  getIntents() {
    this.intents_data.newIntent.subscribe((intents: any) => {
      this.intents = (intents !== '' && intents !== null) ? intents : [];
    });
  }

  convertToIntentTextArray() {
    const intents_text_arr = new Array<object>();
    this.intents.forEach(function (intent) {
      const intent_text_entities = intent.text_entities;
      for (let i = 0; i < intent_text_entities.length; i++) {
        intents_text_arr.push({'intent_id': intent.intent_id, 'intent': intent.intent, 'intent_text': intent_text_entities[i].text});
      }
    });
    this.intents_text_arr = intents_text_arr;
  }

  getEntities() {
    this.entities_data.newEntity.subscribe((entities: any) => {
      this.entities = (entities !== '' && entities !== null) ? entities : [];
      this.convertToEntityTextArray();
      this.entityControl = new FormControl('', requireEntityMatch(this.entities_text_arr));
      this.entitiesfilteredOptions = this.entityControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter_entities(value))
      );
    });
  }

  convertToEntityTextArray() {
    const entities_text_arr = new Array<object>();
    this.entities.forEach(function (entity) {
      if (entity.entity_slot.type === 'categorical') {
        const entities_values = entity.entity_slot.values;
        for (let i = 0; i < entities_values.length; i++) {
          // tslint:disable-next-line:max-line-length
          entities_text_arr.push({'entity_name': entity.entity, 'entity_value': entities_values[i]});
        }
      } else {
        entities_text_arr.push({'entity_name': entity.entity, 'entity_value': ''});
      }
    });
    this.entities_text_arr = entities_text_arr;
  }

  getResponse() {
    this.responses_data.newResponse.subscribe((responses: any) => {
      this.responses = (responses !== '' && responses !== null) ? responses : [];
    });
  }

  convertToResponseTextArray() {
    const responses_text_arr = new Array<object>();
    this.responses.forEach(function (response) {
      const response_text_entities = response.text_entities;
      for (let i = 0; i < response_text_entities.length; i++) {
        // tslint:disable-next-line:max-line-length
        responses_text_arr.push({'response_id': response.response_id, 'response': response.response, 'response_text': response_text_entities[i]});
      }
    });
    this.responses_text_arr = responses_text_arr;
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
    return this.intents_text_arr.filter(option => option.intent_text.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filter_entities(entity: string): string[] {
    const filterValue = entity.toLowerCase();
    return this.entities_text_arr.filter(option => option.entity_name.toLowerCase().includes(filterValue));
  }

  private _filter_responses(response: string): string[] {
    const filterValue = response.toLowerCase();
    return this.responses_text_arr.filter(option => option.response_text.toLowerCase().indexOf(filterValue) === 0);
  }

  drop_intent(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.storyForm.controls['intents_responses']['controls'], event.previousIndex, event.currentIndex);
    moveItemInArray(this.storyForm.controls['intents_responses'].value, event.previousIndex, event.currentIndex);
  }

  drop_response(event: CdkDragDrop<string[]>, intent_index: number) {
    moveItemInArray((<FormArray>(<FormGroup>(<FormArray>this.storyForm.controls['intents_responses'])
    .controls[intent_index]).controls['responses'])['controls'], event.previousIndex, event.currentIndex);
    moveItemInArray((<FormArray>(<FormGroup>(<FormArray>this.storyForm.controls['intents_responses'])
    .controls[intent_index]).controls['responses']).value, event.previousIndex, event.currentIndex);
  }

  /**
   * Adds an intent FormGroup to the intents <FormArray>FormControl(__intents__)
   * @method addCity
   * @param void
   * @return void
   */

  addIntentToStory(intent_response?: IntentResponse): void {
    const intent_id = intent_response ? intent_response.id : '';
    const intent_key = intent_response ? intent_response.key : '';
    const intent_value = intent_response ? intent_response.value : '';
    const type = intent_response ? intent_response.type : 'Intent';
    (<FormArray>this.storyForm.controls['intents_responses']).push(
      new FormGroup({
        id: new FormControl(intent_id, Validators.required),
        key: new FormControl(intent_key, Validators.required),
        value: new FormControl(intent_value, [Validators.required, requireIntentMatch(this.intents_text_arr)]),
        type: new FormControl(type),
      })
    );
    if ((<FormArray>this.storyForm.controls['intents_responses']).length > 0) {
      this.disable_response = false;
    }
    const intent_length = (<FormArray>this.storyForm.controls['intents_responses']).length;
    const intentControl = (<FormArray>this.storyForm.controls['intents_responses']).at(intent_length - 1);
    if (this.intent_response_entity_arr[intent_length - 1] === undefined) {
      this.intent_response_entity_arr[intent_length - 1] = new Array<object>();
    }
    intentControl['controls'].value.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value[0].text),
      map(text => text ? this._filter_intents(text.toString()) : this.intents_text_arr.slice())
    ).subscribe(filteredIntentResult => { this.intentsfilteredOptions = filteredIntentResult; });
    adjustScroll();
  }

  /* New Layout TS Changes */

  addIntentBelowIntent(intent_index: number): void {
    (<FormArray>this.storyForm.controls['intents_responses']).insert(intent_index,
      new FormGroup({
        id: new FormControl('', Validators.required),
        key: new FormControl('', Validators.required),
        value: new FormControl('', [Validators.required, requireIntentMatch(this.intents_text_arr)]),
        type: new FormControl('Intent'),
      })
    );
    const intent_length = (<FormArray>this.storyForm.controls['intents_responses']).length;
    const intentControl = (<FormArray>this.storyForm.controls['intents_responses']).at(intent_length - 1);
    this.intent_response_entity_arr.splice(intent_index, 0, []);
    intentControl['controls'].value.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value[0].text),
      map(text => text ? this._filter_intents(text.toString()) : this.intents_text_arr.slice())
    ).subscribe(filteredIntentResult => { this.intentsfilteredOptions = filteredIntentResult; });
    adjustScroll();
  }

  addResponseToStory(intent_response?: IntentResponse): void {
    const response_id = intent_response ? intent_response.id : '';
    const response_key = intent_response ? intent_response.key : '';
    const response_value = intent_response ? intent_response.value : '';
    const type = intent_response ? intent_response.type : 'Response';
    (<FormArray>this.storyForm.controls['intents_responses']).push(
      new FormGroup({
        id: new FormControl(response_id, Validators.required),
        key: new FormControl(response_key, Validators.required),
        value: new FormControl(response_value, [Validators.required, requireResponseMatch(this.responses_text_arr)]),
        type: new FormControl(type),
      })
    );
    const response_length = (<FormArray>this.storyForm.controls['intents_responses']).length;
    const responseControl = (<FormArray>this.storyForm.controls['intents_responses']).at(response_length - 1);
    if (this.intent_response_entity_arr[response_length - 1] === undefined) {
      this.intent_response_entity_arr[response_length - 1] = new Array<object>();
    }
    responseControl['controls'].value.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value[0].text),
      map(text => text ? this._filter_responses(text.toString()) : this.responses_text_arr.slice())
    ).subscribe(filteredResponseResult => { this.responsesfilteredOptions = filteredResponseResult; });
    adjustScroll();
  }

  addResponseBelowResponse(response_index: number): void {
    (<FormArray>this.storyForm.controls['intents_responses']).insert(response_index,
      new FormGroup({
        id: new FormControl('', Validators.required),
        key: new FormControl('', Validators.required),
        value: new FormControl('', [Validators.required, requireResponseMatch(this.responses_text_arr)]),
        type: new FormControl('Response'),
      })
    );
    const response_length = (<FormArray>this.storyForm.controls['intents_responses']).length;
    const responseControl = (<FormArray>this.storyForm.controls['intents_responses']).at(response_length - 1);
    this.intent_response_entity_arr.splice(response_index, 0, []);
    responseControl['controls'].value.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value[0].text),
      map(text => text ? this._filter_responses(text.toString()) : this.responses_text_arr.slice())
    ).subscribe(filteredResponseResult => { this.responsesfilteredOptions = filteredResponseResult; });
    adjustScroll();
  }

  removeIntentORResponseFromStory(intent_index: number) {
    if (intent_index === 0 && (<FormArray>this.storyForm.controls['intents_responses']).length > 1) {
      if ((<FormArray>this.storyForm.controls['intents_responses']).at(intent_index + 1).value['type'] === 'Response') {
        this.show_intent_error = true;
        setTimeout(() => {
          this.show_intent_error = false;
        }, 2000);
      }
    } else {
      this.show_intent_error = false;
      (<FormArray>this.storyForm.controls['intents_responses']).removeAt(intent_index);
      this.intent_response_entity_arr.splice(intent_index, 1);
      if ((<FormArray>this.storyForm.controls['intents_responses']).length === 0) {
        this.disable_response = true;
      }
    }
    adjustScroll();
  }

  removeResponseFromIntent(intent_index: number, response_index: number) {
    (<FormArray>(<FormGroup>(<FormArray>this.storyForm.controls['intents_responses'])
    .controls[intent_index]).controls['responses']).removeAt(response_index);
  }

  removeEntityFromIntentResponse(intent_response_index: number, entity_index: number) {
    this.intent_response_entity_arr[intent_response_index].splice(entity_index, 1);
  }

  onIntentChange(event: any, intent_index: number, intent_id: number, intent: string) {
    if (event.source.selected) {
      const storyControl = (<FormArray>this.storyForm.controls['intents_responses']).at(intent_index);
      storyControl['controls'].id.setValue(intent_id);
      storyControl['controls'].key.setValue(intent);
    }
  }

  onResponseChange(event: any, response_index: number, response_id: number, response: string) {
    if (event.source.selected) {
      const storyControl = (<FormArray>this.storyForm.controls['intents_responses']).at(response_index);
      storyControl['controls'].id.setValue(response_id);
      storyControl['controls'].key.setValue(response);
    }
  }

  onEntityChange(event: any, intent_response_index: number) {
    if (event.source.selected) {
      const entity_name_value = event.source._element.nativeElement.innerText.split(':');
      if (entity_name_value[1] === '') {
        const dialogRef = this.dialog.open(AddEntityValueComponent);
        dialogRef.afterClosed().subscribe(res => {
          if (res) {
            entity_name_value[1] = res;
            // tslint:disable-next-line: max-line-length
            this.intent_response_entity_arr[intent_response_index].push({'entity_name': entity_name_value[0], 'entity_value': entity_name_value[1]});
          }
        });
      } else {
        // tslint:disable-next-line: max-line-length
        this.intent_response_entity_arr[intent_response_index].push({'entity_name': entity_name_value[0], 'entity_value': entity_name_value[1]});
      }
      event.source.value = '';
    }
  }

  handleSpacebar(event: any) {
    if (event.keyCode === 32 || event.keyCode === 13) {
      event.stopPropagation();
    }
  }

  collapse_close(type: string, index: number) {
    collapseClose(type, index);
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

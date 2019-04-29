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
import { MatDialog } from '@angular/material/dialog';
import { AddEntityValueComponent } from '../common/modals/add-entity-value/add-entity-value.component';
import { MatSnackBar } from '@angular/material';

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

  intent_entity_arr = new Array<object[]>();

  intents_responses: any;
  intents_responses_backup: any;

  intents_entities_responses: any;

  removable = true;
  selectable = true;

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
      this.intents_entities_responses.forEach((intent, intentIndex) => {
        this.intents_entities_responses[intentIndex]['entities'] = this.intent_entity_arr[intentIndex];
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

    const intents: FormArray = new FormArray([]);

    this.storyForm = this.fb.group({
      intents_responses: intents
    });

    if (!story) {
      // Creating a new story
      this.addIntentToStory();
      this.addResponseToIntent(0);
    } else {
      // Editing a story
      story.intents_responses.forEach((intent, intentIndex) => {
        this.addIntentToStory(intent);
        if (this.intent_entity_arr[intentIndex] === undefined) {
          this.intent_entity_arr[intentIndex] = new Array<object>();
        }
        this.intent_entity_arr[intentIndex] = intent.entities;
        intent.responses.forEach((response, responseIndex) => {
          this.addResponseToIntent(intentIndex, response);
        });
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

  private _filter_entities(value: string): string[] {
    const filterValue = value.toLowerCase();
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

  addIntentToStory(intent?: Intent): void {
    const responses = new FormArray([]);
    const intent_id = intent ? intent.intent_id : '';
    const intent_intent = intent ? intent.intent : '';
    const intent_text = intent ? intent.intent_text : '';
    (<FormArray>this.storyForm.controls['intents_responses']).push(
      new FormGroup({
        intent_id: new FormControl(intent_id, Validators.required),
        intent: new FormControl(intent_intent, Validators.required),
        intent_text: new FormControl(intent_text, [Validators.required, requireIntentMatch(this.intents_text_arr)]),
        responses: responses
      })
    );
    const intent_length = (<FormArray>this.storyForm.controls['intents_responses']).length;
    const intentControl = (<FormArray>this.storyForm.controls['intents_responses']).at(intent_length - 1);
    intentControl['controls'].intent_text.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value[0].text),
      map(text => text ? this._filter_intents(text.toString()) : this.intents_text_arr.slice())
    ).subscribe(filteredIntentResult => { this.intentsfilteredOptions = filteredIntentResult; });
  }

  removeIntentFromStory(intent_index: number) {
    (<FormArray>this.storyForm.controls['intents_responses']).removeAt(intent_index);
  }

  /**
   * Adds a response FormGroup to the intent's <FormArray>FormControl(__responses__)
   * @method addResponseToIntent
   * @param {intent_index} index of the intent to which response is to be added
   * @return {void}
   */

  addResponseToIntent(intent_index: number, response?: Response): void {
    const response_id = response ? response.response_id : '';
    const response_response = response ? response.response : '';
    const response_text = response ? response.response_text : '';

    (<FormArray>(<FormGroup>(<FormArray>this.storyForm.controls['intents_responses'])
      .controls[intent_index]).controls['responses']).push(
        new FormGroup({
          response_id: new FormControl(response_id, Validators.required),
          response: new FormControl(response_response, Validators.required),
          response_text: new FormControl(response_text, [Validators.required, requireResponseMatch(this.responses_text_arr)]),
        })
    );

    const response_length = (<FormArray>(<FormGroup>(<FormArray>this.storyForm.controls['intents_responses'])
    .controls[intent_index]).controls['responses']).length;
    const responseControl = (<FormArray>(<FormGroup>(<FormArray>this.storyForm.controls['intents_responses'])
    .controls[intent_index]).controls['responses']).at(response_length - 1);
    responseControl['controls'].response_text.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value[0].text),
      map(text => text ? this._filter_responses(text.toString()) : this.responses_text_arr.slice())
    ).subscribe(filteredResponseResult => { this.responsesfilteredOptions = filteredResponseResult; });
  }

  removeResponseFromIntent(intent_index: number, response_index: number) {
    (<FormArray>(<FormGroup>(<FormArray>this.storyForm.controls['intents_responses'])
    .controls[intent_index]).controls['responses']).removeAt(response_index);
  }

  removeEntityFromIntent(intent_index: number, entity_index: number) {
    this.intent_entity_arr[intent_index].splice(entity_index, 1);
  }

  onIntentChange(event: any, intent_index: number, intent_id: number, intent: string) {
    if (event.source.selected) {
      console.log(event);
      const storyControl = (<FormArray>this.storyForm.controls['intents_responses']).at(intent_index);
      storyControl['controls'].intent_id.setValue(intent_id);
      storyControl['controls'].intent.setValue(intent);
    }
  }

  onResponseChange(event: any, intent_index: number, response_index: number, response_id: number, response: string) {
    if (event.source.selected) {
      const storyControl = (<FormArray>(<FormGroup>(<FormArray>this.storyForm.controls['intents_responses'])
      .controls[intent_index]).controls['responses']).at(response_index);
      storyControl['controls'].response_id.setValue(response_id);
      storyControl['controls'].response.setValue(response);
    }
  }

  onEntityChange(event: any, intent_index: number) {
    if (event.source.selected) {
      const entity_name_value = event.source._element.nativeElement.innerText.split(':');
      if (this.intent_entity_arr[intent_index] === undefined) {
        this.intent_entity_arr[intent_index] = new Array<object>();
      }
      if (entity_name_value[1] === '') {
        const dialogRef = this.dialog.open(AddEntityValueComponent);
        dialogRef.afterClosed().subscribe(res => {
          if (res) {
            entity_name_value[1] = res;
            this.intent_entity_arr[intent_index].push({'entity_name': entity_name_value[0], 'entity_value': entity_name_value[1]});
          }
        });
      } else {
        this.intent_entity_arr[intent_index].push({'entity_name': entity_name_value[0], 'entity_value': entity_name_value[1]});
      }
      event.source.value = '';
    }
  }

  handleSpacebar(event: any) {
    if (event.keyCode === 32 || event.keyCode === 13) {
      event.stopPropagation();
    }
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

import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource, MatAutocompleteModule, MatAutocomplete } from '@angular/material';
import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChooseEntityComponent } from '../common/modals/choose-entity/choose-entity.component';
import { EntitiesDataService } from '../common/services/entities-data.service';
import { WebSocketService } from '../common/services/web-socket.service';

declare var selectText: Function;
declare var highlightText: Function;
declare var unhighlightText: Function;

@Component({
  selector: 'app-manage-intents',
  templateUrl: './manage-intents.component.html',
  styleUrls: ['./manage-intents.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageIntentsComponent implements OnInit {

  intentForm: FormGroup;
  intentFormArray: FormArray;
  intentHasError: Array<boolean>;
  entities: any;
  entityValue: any;
  entity_value = '';
  entitiesControl = new FormControl();
  entityfilteredOptions: Observable<string[]>;
  new_intent_text: string;

  constructor(public dialog: MatDialog,
              private entities_service: EntitiesDataService,
              private webSocketService: WebSocketService) {}

  currentIntent: any;
  text_entities: any;
  text_entities_backup: any;
  @Input() intentObjectId: string;
  @Input() projectObjectId: string;

  ngOnInit() {
    this.getEntities();
    this.getIntentDetails();
  }

  getEntities() {
    this.entities_service.createEntitiesRoom();
    this.entities_service.getEntities({project_id: this.projectObjectId}).subscribe(entities => {
      this.entities = entities;
      this.entityfilteredOptions = this.entitiesControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  getIntentDetails() {
    this.webSocketService.createIntentRoom('intent_' + this.intentObjectId);
    this.webSocketService.getIntentDetails({object_id: this.intentObjectId}, 'intent_' + this.intentObjectId).subscribe(intent_details => {
      this.currentIntent = intent_details;
      this.text_entities = this.text_entities_backup = this.currentIntent.text_entities;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  applyMapFilter(filterValue: string) {
    this.text_entities = this.text_entities_backup;
    this.text_entities = this.text_entities.filter((value) => {
      if (value.text.includes(filterValue.trim())) {
        return value;
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.entities.filter(option => option.entity_name.toLowerCase().includes(filterValue));
  }

  addIntentTextElement() {
    if (this.new_intent_text.trim() !== '') {
      // tslint:disable-next-line: max-line-length
      this.webSocketService.createIntentText({object_id: this.intentObjectId, text: this.new_intent_text, entities: []}, 'intent_' + this.intentObjectId);
      this.new_intent_text = '';
    }
  }

  removeIntentTextElement(index_text: string, intent_text_entities: Array<string>) {
    // tslint:disable-next-line: max-line-length
    this.webSocketService.deleteIntentText({object_id: this.intentObjectId, text: index_text, entities: intent_text_entities}, 'intent_' + this.intentObjectId);
  }

  getEntityValue(entity_value: string) {
    this.entity_value = entity_value;
  }

  mouseUpFunction(event: any, intent_text_index: number, intent_text: string, intent_text_entities: Array<string>) {
    this.entityValue = selectText(event);
    if (this.entity_value !== '') {
      if (this.entityValue !== 0) {
        const selected_entity = this.entities.filter((value) => {
          if (value.entity_name === this.entity_value) {
            return value;
          }
        })[0];
        if (selected_entity['entity_slot']['type'] === 'categorical') {
          const dialogRef = this.dialog.open(ChooseEntityComponent, {
            width: '300px',
            data: {selected_entity: selected_entity}
          });
          dialogRef.afterClosed().subscribe(entity_value => {
            if (entity_value !== '') {
              delete this.entityValue['text_id'];
              this.entityValue['value'] = entity_value.chosen_entity_value;
              this.entityValue['entity'] = this.entity_value;
              intent_text_entities.push(this.entityValue);
              // tslint:disable-next-line: max-line-length
              this.webSocketService.editIntentText({object_id: this.intentObjectId, doc_index: '' + intent_text_index, text: intent_text, entities: intent_text_entities}, 'intent_' + this.intentObjectId);
              toggleIntentEntity(event);
            }
          });
        } else {
          delete this.entityValue['text_id'];
          this.entityValue['entity'] = this.entity_value;
          intent_text_entities.push(this.entityValue);
          // tslint:disable-next-line: max-line-length
          this.webSocketService.editIntentText({object_id: this.intentObjectId, doc_index: '' + intent_text_index, text: intent_text, entities: intent_text_entities}, 'intent_' + this.intentObjectId);
          toggleIntentEntity(event);
        }
      }
    } else {
      const dialogRef = this.dialog.open(ChooseEntityComponent, {
        width: '300px',
        data: {selected_entity: '', entities: this.entities}
      });
      dialogRef.afterClosed().subscribe(entity_value => {
        if (entity_value !== '') {
          if (entity_value.chosen_entity_value !== '') {
            this.entityValue['value'] = entity_value.chosen_entity_value;
          }
          delete this.entityValue['text_id'];
          this.entityValue['entity'] = entity_value.chosen_entity;
          intent_text_entities.push(this.entityValue);
          // tslint:disable-next-line: max-line-length
          this.webSocketService.editIntentText({object_id: this.intentObjectId, doc_index: '' + intent_text_index, text: intent_text, entities: intent_text_entities}, 'intent_' + this.intentObjectId);
          toggleIntentEntity(event);
        }
      });
    }
  }

  removeEntityElement(intent_text_index: number, intent_text: string, intent_text_entities: Array<string>, entity_index: number) {
    intent_text_entities.splice(entity_index, 1);
    // tslint:disable-next-line: max-line-length
    this.webSocketService.editIntentText({object_id: this.intentObjectId, doc_index: '' + intent_text_index, text: intent_text, entities: intent_text_entities}, 'intent_' + this.intentObjectId);
  }

  highlightTextEntity(entity_start: number, entity_end: number, index: number) {
    highlightText('intent_text_' + index, entity_start, entity_end);
  }

  unhighlightTextEntity(index: number) {
    unhighlightText('intent_text_' + index);
  }
}

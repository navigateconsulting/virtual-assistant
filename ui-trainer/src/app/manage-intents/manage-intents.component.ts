import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource, MatAutocompleteModule, MatAutocomplete } from '@angular/material';
import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChooseEntityComponent } from '../common/modals/choose-entity/choose-entity.component';
import { EntitiesDataService } from '../common/services/entities-data.service';

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

  displayedColumns: string[] = ['Index', 'Intent Text', 'Delete'];
  dataSource: any;
  text_entities: any;
  text_entities_backup: any;
  intentForm: FormGroup;
  intentFormArray: FormArray;
  intentHasError: Array<boolean>;
  entities: any;
  entityValue: any;
  entity_value = '';
  entitiesControl = new FormControl();
  entityfilteredOptions: Observable<string[]>;
  new_intent_text: string;

  constructor(private entities_data: EntitiesDataService, public dialog: MatDialog) {}

  @Input() currentIntent: any;

  @Output() saveIntentJSON = new EventEmitter<{ intent_index: number, text_entities: [{}] }>();
  @Output() saveIntentEntityValue = new EventEmitter<{ intent_text_index: number, intent_entities: {} }>();

  ngOnInit() {
    this.text_entities = this.text_entities_backup = this.currentIntent.text_entities;
    this.intentHasError = new Array<boolean>();
    if (this.text_entities.length > 0) {
      for (let i = 0; i < this.text_entities.length; i++) {
        this.intentHasError.push(false);
      }
    }
    this.dataSource = new MatTableDataSource(this.text_entities);

    this.entities_data.newEntity.subscribe(entities => {
      this.entities = entities;
      this.entityfilteredOptions = this.entitiesControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    return this.entities.filter(option => option.entity.toLowerCase().includes(filterValue));
  }

  addIntentTextElement() {
    if (this.new_intent_text.trim() !== '') {
      this.text_entities.push({text: this.new_intent_text, entities: []});
      this.new_intent_text = '';
      this.saveIntentJSONMethod();
    }
  }

  removeIntentTextElement(index: number) {
    this.text_entities.splice(index, 1);
    this.saveIntentJSONMethod();
  }

  getEntityValue(entity_value: string) {
    this.entity_value = entity_value;
  }

  mouseUpFunction(event: any) {
    this.entityValue = selectText(event);
    if (this.entity_value !== '') {
      if (this.entityValue !== 0) {
        const selected_entity = this.entities.filter((value) => {
          if (value.entity === this.entity_value) {
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
              this.text_entities[+event.target.id.split('_')[2]]['entities'].push(this.entityValue);
              this.saveIntentJSONMethod();
              toggleIntentEntity(event);
            }
          });
        } else {
          delete this.entityValue['text_id'];
          this.entityValue['entity'] = this.entity_value;
          this.text_entities[+event.target.id.split('_')[2]]['entities'].push(this.entityValue);
          this.saveIntentJSONMethod();
          toggleIntentEntity(event);
        }
      }
    } else {
      const dialogRef = this.dialog.open(ChooseEntityComponent, {
        width: '300px',
        data: {selected_entity: '', entities: this.entities}
      });
      dialogRef.afterClosed().subscribe(entity_value => {
        if (entity_value.chosen_entity_value !== '') {
          this.entityValue['value'] = entity_value.chosen_entity_value;
        }
        delete this.entityValue['text_id'];
        this.entityValue['entity'] = entity_value.chosen_entity;
        this.text_entities[+event.target.id.split('_')[2]]['entities'].push(this.entityValue);
        this.saveIntentJSONMethod();
        toggleIntentEntity(event);
      });
    }
  }

  removeEntityElement(intent_index: number, entity_index: number) {
    this.text_entities[intent_index]['entities'].splice(entity_index, 1);
    this.saveIntentJSONMethod();
  }

  highlightTextEntity(entity_start: number, entity_end: number, index: number) {
    highlightText('intent_text_' + index, entity_start, entity_end);
  }

  unhighlightTextEntity(index: number) {
    unhighlightText('intent_text_' + index);
  }

  saveIntentJSONMethod() {
    this.saveIntentJSON.emit({ intent_index: this.currentIntent.intent_id, text_entities: this.text_entities });
  }
}

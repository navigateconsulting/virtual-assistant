import { Component, OnInit, Input, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material';
import { FormControl, FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ChooseEntityComponent } from '../common/modals/choose-entity/choose-entity.component';
import { SharedDataService } from '../common/services/shared-data.service';
import { constant } from '../../environments/constants';
import { NotificationsService } from '../common/services/notifications.service';
import { ApiService } from '../common/services/apis.service';

declare var selectText: Function;
declare var highlightText: Function;
declare var unhighlightText: Function;

@Component({
  selector: 'app-manage-intents',
  templateUrl: './manage-intents.component.html',
  styleUrls: ['./manage-intents.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageIntentsComponent implements OnInit, OnDestroy {

  intentForm: FormGroup;
  intentFormArray: FormArray;
  intentHasError: Array<boolean>;
  entities: any;
  entityValue: any;
  entity_value = '';
  entitiesControl = new FormControl();
  entityfilteredOptions: Observable<string[]>;
  new_intent_text: string;
  show_invalid_entity_error = false;
  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;

  constructor(public dialog: MatDialog,
              public apiService: ApiService,
              public sharedDataService: SharedDataService,
              public notificationsService: NotificationsService) {}

  currentIntent: any;
  text_entities: Array<object>;
  text_entities_backup: Array<object>;
  @Input() intentObjectId: string;
  @Input() projectObjectId: string;
  @Input() domainObjectId: string;

  ngOnInit() {
    this.text_entities = new Array<object>();
    this.text_entities_backup = new Array<object>();
    this.getEntities();
    this.forceReload();
    this.sharedDataService.setSharedData('activeTabIndex', '0', constant.MODULE_COMMON);
  }

  getEntities() {
    this.apiService.requestEntities(this.projectObjectId).subscribe(entities => {
      if (entities) {
        this.entities = entities;
        this.entityfilteredOptions = this.entitiesControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  getIntentDetails() {
    this.apiService.requestIntentDetails(this.intentObjectId).subscribe(intent_details => {
      if (intent_details) {
        this.currentIntent = intent_details;
        this.text_entities = this.text_entities_backup = this.currentIntent.text_entities;
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  applyMapFilter(filterValue: string) {
    this.text_entities = this.text_entities_backup;
    this.text_entities = this.text_entities.filter((value) => {
      if (value['text'].includes(filterValue.trim().toLowerCase()) || value['text'].includes(filterValue.trim().toUpperCase())) {
        return value;
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.entities.filter(option => option.entity_name.toLowerCase().includes(filterValue));
  }

  addIntentTextElement(event: any) {
    if (this.new_intent_text.trim() !== '') {
      const checkDuplicateIntentTextValue = this.checkDuplicateIntentTextValue(this.new_intent_text.trim());
      if (!checkDuplicateIntentTextValue) {
        const new_intent_text_arr = this.new_intent_text.split(' ');
        for (let i = 0; i < new_intent_text_arr.length; i++) {
          if (new_intent_text_arr[i].includes('"')) {
            new_intent_text_arr[i] = new_intent_text_arr[i].split('"').join('\\"');
          }
        }
        this.new_intent_text = new_intent_text_arr.join(' ');
        // tslint:disable-next-line: max-line-length
        this.apiService.createIntentText({object_id: this.intentObjectId, text: this.new_intent_text, entities: []}, this.intentObjectId).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
      } else {
        this.notificationsService.showToast({status: 'Error', message: 'Intent Text Already Exists'});
      }
      this.new_intent_text = '';
      if (event.which === 13) {
        event.preventDefault();
      }
    }
  }

  removeIntentTextElement(index_text: string, intent_text_entities: Array<string>) {
    this.apiService.deleteIntentText({object_id: this.intentObjectId, text: index_text, entities: intent_text_entities}, this.intentObjectId).subscribe(result => {
      if (result) {
        this.notificationsService.showToast(result);
        this.forceReload();
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  getEntityValue(entity_string: string) {
    if (entity_string.trim() !== '') {
      if (this.checkEntityValue(entity_string)) {
        this.show_invalid_entity_error = false;
      }
    } else {
      this.trigger.closePanel();
    }
  }

  mouseUpFunction(event: any, intent_text_index: number, intent_text: string, intent_text_entities: Array<string>) {
    this.entityValue = selectText(event);
    const checkEntityValue = this.checkEntityValue(this.entity_value);
    const checkPrevEntityValue = this.checkPrevEntityValue(intent_text_index, this.entityValue);
    if (!checkPrevEntityValue) {
      if (this.entity_value !== '' && checkEntityValue) {
        this.show_invalid_entity_error = false;
        if (this.entityValue !== 0 && this.entityValue['value'].trim() !== '') {
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
                // this.webSocketService.editIntentText({object_id: this.intentObjectId, doc_index: '' + intent_text_index, text: intent_text, entities: intent_text_entities}, 'intent_' + this.intentObjectId);
                this.apiService.editIntentText({object_id: this.intentObjectId, doc_index: '' + intent_text_index, text: intent_text, entities: intent_text_entities}, this.intentObjectId).subscribe(result => {
                  if (result) {
                    this.notificationsService.showToast(result);
                    this.forceReload();
                  }
                },
                err => console.error('Observer got an error: ' + err),
                () => console.log('Observer got a complete notification'));
                toggleIntentEntity(intent_text_index);
              }
            });
          } else {
            delete this.entityValue['text_id'];
            this.entityValue['entity'] = this.entity_value;
            intent_text_entities.push(this.entityValue);
            this.apiService.editIntentText({object_id: this.intentObjectId, doc_index: '' + intent_text_index, text: intent_text, entities: intent_text_entities}, this.intentObjectId).subscribe(result => {
              if (result) {
                this.notificationsService.showToast(result);
                this.forceReload();
              }
            },
            err => console.error('Observer got an error: ' + err),
            () => console.log('Observer got a complete notification'));
            toggleIntentEntity(intent_text_index);
          }
        }
      } else if (this.entityValue !== 0 && this.entityValue['value'].trim() !== '') {
        if (this.entity_value === '') {
          this.show_invalid_entity_error = false;
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
              this.apiService.editIntentText({object_id: this.intentObjectId, doc_index: '' + intent_text_index, text: intent_text, entities: intent_text_entities}, this.intentObjectId).subscribe(result => {
                if (result) {
                  this.notificationsService.showToast(result);
                  this.forceReload();
                }
              },
              err => console.error('Observer got an error: ' + err),
              () => console.log('Observer got a complete notification'));
              toggleIntentEntity(intent_text_index);
            }
          });
        } else if (!checkEntityValue) {
          this.show_invalid_entity_error = true;
        }
      }
    } else {
      this.notificationsService.showToast({status: 'Error', message: 'Text Entity Already Exists'});
    }
  }

  checkEntityValue(entity_value: string) {
    const selected_entity = this.entities.filter((value) => {
      if (value.entity_name === entity_value) {
        return value;
      }
    })[0];
    if (selected_entity === undefined) {
      return false;
    } else {
      return true;
    }
  }

  checkPrevEntityValue(intent_text_index: number, entity_value: object) {
    const check_prev_entity_value = this.text_entities[intent_text_index]['entities'].filter((value) => {
      if (value['start'] === entity_value['start'] && value['end'] === entity_value['end'] && value['value'] === entity_value['value']) {
        return value;
      }
    })[0];
    if (check_prev_entity_value === undefined) {
      return false;
    } else {
      return true;
    }
  }

  checkDuplicateIntentTextValue(intent_text: string) {
    const check_duplicate_intent_text_value = this.text_entities.filter((value) => {
      if (value['text'] === intent_text) {
        return value;
      }
    })[0];
    if (check_duplicate_intent_text_value === undefined) {
      return false;
    } else {
      return true;
    }
  }

  removeEntityElement(intent_text_index: number, intent_text: string, intent_text_entities: Array<string>, entity_index: number) {
    intent_text_entities.splice(entity_index, 1);
    this.apiService.editIntentText({object_id: this.intentObjectId, doc_index: '' + intent_text_index, text: intent_text, entities: intent_text_entities}, this.intentObjectId).subscribe(result => {
      if (result) {
        this.notificationsService.showToast(result);
        this.forceReload();
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
    toggleIntentEntity(intent_text_index);
  }

  highlightTextEntity(entity_start: number, entity_end: number, index: number) {
    highlightText('intent_text_' + index, entity_start, entity_end);
  }

  unhighlightTextEntity(index: number) {
    unhighlightText('intent_text_' + index);
  }

  disableQuotes(event: any) {
    if (event.which === 222) {
      this.new_intent_text = this.new_intent_text.slice(0, -1);
    }
  }

  closeAutoCompPanel() {
    setTimeout(() => {
      this.trigger.closePanel();
    }, 100);
  }

  forceReload() {
    this.apiService.forceIntentDetailsCacheReload('reset');
    this.getIntentDetails();
  }

  ngOnDestroy(): void {
    this.apiService.forceIntentDetailsCacheReload('finish');
    this.dialog.closeAll();
    this.apiService.clearCache('intents_'+this.projectObjectId+"_"+this.domainObjectId).subscribe(result => {
      console.log(result);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }
}

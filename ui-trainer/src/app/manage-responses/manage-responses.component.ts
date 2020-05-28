import { Component, OnInit, Input, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { SharedDataService } from '../common/services/shared-data.service';
import { NotificationsService } from '../common/services/notifications.service';
import { constant } from '../../environments/constants';
import { MatInput } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { ApiService } from '../common/services/apis.service';

@Component({
  selector: 'app-manage-responses',
  templateUrl: './manage-responses.component.html',
  styleUrls: ['./manage-responses.component.scss']
})
export class ManageResponsesComponent implements OnInit, OnDestroy {

  text_entities: Array<string>;
  text_entities_backup: Array<string>;
  entities: any;
  entities_backup: any;
  new_response_text: string;
  showEntityDropdown = false;
  show_empty_entity_error = false;
  readonly = false;
  currentResponse: any;

  private subscription: Subscription = new Subscription();

  @Input() responseObjectId: string;
  @Input() projectObjectId: string;

  @ViewChild('responseText') responseTextInput: MatInput;

  constructor(public apiService: ApiService,
              public sharedDataService: SharedDataService,
              public notificationsService: NotificationsService) { }

  ngOnInit() {
    this.text_entities = new Array<string>();
    this.text_entities_backup = new Array<string>();
    this.getEntities();
    this.getResponseDetails();
    this.sharedDataService.setSharedData('activeTabIndex', '1', constant.MODULE_COMMON);
  }

  getEntities() {
    this.apiService.requestEntities(this.projectObjectId).subscribe(entities => {
      if (entities) {
        this.entities = this.entities_backup = entities;
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  getResponseDetails() {
    this.apiService.requestResponseDetails(this.responseObjectId).subscribe(response_details => {
      if (response_details) {
        console.log(response_details);
        this.currentResponse = response_details;
        this.text_entities = this.text_entities_backup = this.currentResponse.text_entities;
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  addResponseTextElement(event: any) {
    if (this.new_response_text.trim() !== '') {
      const checkPrevResponseTextValue = this.checkDuplicateResponseTextValue(this.new_response_text.trim());
      if (!checkPrevResponseTextValue) {
        const new_response_text_arr = this.new_response_text.split(' ');
        for (let i = 0; i < new_response_text_arr.length; i++) {
          if (new_response_text_arr[i].includes('"')) {
            new_response_text_arr[i] = new_response_text_arr[i].split('"').join('\\"');
          }
        }
        this.new_response_text = new_response_text_arr.join(' ');
        this.apiService.createResponseText({object_id: this.responseObjectId, text_entities: this.new_response_text}, this.responseObjectId).subscribe(result => {
          if (result) {
            this.notificationsService.showToast(result);
            this.forceReload();
          }
        },
        err => console.error('Observer got an error: ' + err),
        () => console.log('Observer got a complete notification'));
      } else {
        this.notificationsService.showToast({status: 'Error', message: 'Response Text Already Exists'});
      }
      this.new_response_text = '';
      if (event.which === 13) {
        event.preventDefault();
      }
    }
  }

  checkDuplicateResponseTextValue(response_text: string) {
    const check_duplicate_intent_text_value = this.text_entities.filter((value) => {
      if (value === response_text) {
        return value;
      }
    })[0];
    if (check_duplicate_intent_text_value === undefined) {
      return false;
    } else {
      return true;
    }
  }

  removeResponseTextElement(text_entity: string) {
    this.apiService.deleteResponseText({object_id: this.responseObjectId, text_entities: text_entity}, this.responseObjectId).subscribe(result => {
      if (result) {
        this.notificationsService.showToast(result);
        this.forceReload();
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  applyMapFilter(filterValue: string) {
    this.text_entities = this.text_entities_backup;
    this.text_entities = this.text_entities.filter((value) => {
      if (value.includes(filterValue.trim().toLowerCase()) || value.includes(filterValue.trim().toUpperCase())) {
        return value;
      }
    });
  }

  applyEntityFilter(filterValue: string) {
    this.entities = this.entities_backup;
    this.entities = this.entities.filter((value) => {
      if (value.entity_name.includes(filterValue.trim().toLowerCase()) || value.entity_name.includes(filterValue.trim().toUpperCase())) {
        return value;
      }
    });
  }

  populateEntities(event: any) {
    if (event.which === 219 && event.key === '{') {
      if (this.entities.length > 0) {
        this.showEntityDropdown = true;
      } else {
        this.show_empty_entity_error = true;
      }
      this.readonly = true;
    }
  }

  selectEntity(entity: string) {
    this.new_response_text = this.new_response_text + entity + '} ';
    this.showEntityDropdown = false;
    this.readonly = false;
    this.responseTextInput.focus();
  }

  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: any) {
    if (event.key === 'Escape') {
      this.new_response_text = this.new_response_text.slice(0, -1);
      this.showEntityDropdown = false;
      this.readonly = false;
      this.show_empty_entity_error = false;
    } else if (event.key === 'Backspace') {
      const new_response_text_arr = this.new_response_text.split(' ');
      if (new_response_text_arr[new_response_text_arr.length - 1].includes('{')) {
        if (!new_response_text_arr[new_response_text_arr.length - 1].includes('}')) {
          new_response_text_arr.pop();
          new_response_text_arr.push('');
        }
      }
      this.new_response_text = new_response_text_arr.join(' ');
    }
  }

  forceReload() {
    this.apiService.forceResponseDetailsCacheReload('reset');
    this.getResponseDetails();
  }

  ngOnDestroy(): void {
    this.apiService.forceResponseDetailsCacheReload('finish');
  }

}

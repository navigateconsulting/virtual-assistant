import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { EntitiesDataService } from '../common/services/entities-data.service';

@Component({
  selector: 'app-manage-responses',
  templateUrl: './manage-responses.component.html',
  styleUrls: ['./manage-responses.component.scss']
})
export class ManageResponsesComponent implements OnInit {

  text_entities: any;
  text_entities_backup: any;
  entities: any;
  entities_backup: any;
  new_response_text: string;
  showEntityDropdown = false;
  readonly = false;

  @Input() currentResponse: any;

  @Output() saveResponseJSON = new EventEmitter<{ response_index: number, text_entities: [] }>();

  constructor(private entities_data: EntitiesDataService) { }

  ngOnInit() {
    this.text_entities = this.text_entities_backup = this.currentResponse.text_entities;
    this.entities_data.newEntity.subscribe(entities => {
      this.entities = this.entities_backup = entities;
    });
  }

  addResponseTextElement() {
    if (this.new_response_text.trim() !== '') {
      const new_response_text_arr = this.new_response_text.split(' ');
      for (let i = 0; i < new_response_text_arr.length; i++) {
        if (new_response_text_arr[i].includes('@')) {
          new_response_text_arr[i] = new_response_text_arr[i].replace('@', '{');
          new_response_text_arr[i] += '}';
        }
      }
      this.new_response_text = new_response_text_arr.join(' ');
      this.text_entities.push(this.new_response_text);
      this.new_response_text = '';
      this.saveResponseJSONMethod();
    }
  }

  removeResponseTextElement(index: number) {
    this.text_entities.splice(index, 1);
    this.saveResponseJSONMethod();
  }

  applyMapFilter(filterValue: string) {
    this.text_entities = this.text_entities_backup;
    this.text_entities = this.text_entities.filter((value) => {
      if (value.text.includes(filterValue.trim())) {
        return value;
      }
    });
  }

  applyEntityFilter(filterValue: string) {
    this.entities = this.entities_backup;
    this.entities = this.entities.filter((value) => {
      if (value.entity.includes(filterValue.trim())) {
        return value;
      }
    });

  }

  populateEntities(event: any) {
    if (event.which === 50 && event.key !== '2') {
      this.showEntityDropdown = true;
      this.readonly = true;
    }
  }

  selectEntity(entity: string) {
    this.new_response_text = this.new_response_text + entity;
    this.showEntityDropdown = false;
    this.readonly = false;
  }

  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.new_response_text = this.new_response_text.slice(0, -1);
      this.showEntityDropdown = false;
      this.readonly = false;
    }
  }

  saveResponseJSONMethod() {
    this.saveResponseJSON.emit({ response_index: this.currentResponse.response_id, text_entities: this.text_entities });
  }

}

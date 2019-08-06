import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatInput } from '@angular/material/input';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-entity',
  templateUrl: './add-entity.component.html',
  styleUrls: ['./add-entity.component.scss']
})
export class AddEntityComponent implements OnInit {

  entity_name: string;
  entity_desc: string;
  entitySlotType: string;
  categorical_values: string;
  min_value: number;
  max_value: number;
  show_cat_error: boolean;
  show_entity_error: boolean;
  @ViewChild('entityDescription') entityDescriptionInput: MatInput;
  appSource: string;

  constructor(public dialogRef: MatDialogRef<AddEntityComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.entity_name = this.data.entity_name;
    this.show_cat_error = false;
    this.show_entity_error = false;
    this.entityDescriptionInput.focus();
  }

  setEntitySlotType(event: any) {
    this.entitySlotType = event.value;
    this.show_entity_error = false;
  }

  saveEntitySlotDetails() {
    let entity_slot_details = {};
    if (this.entitySlotType !== undefined && this.entitySlotType !== '') {
      if (this.entitySlotType === 'categorical') {
        if (this.categorical_values[this.categorical_values.length - 1] === ',') {
          this.show_cat_error = true;
          return;
        } else {
          this.show_cat_error = false;
        }
        entity_slot_details = {type: this.entitySlotType, values: this.categorical_values.split(',')};
      } else if (this.entitySlotType === 'float') {
        entity_slot_details = {type: this.entitySlotType, values: {min_value: this.min_value, max_value: this.max_value}};
      } else {
        entity_slot_details = {type: this.entitySlotType, values: []};
      }
      this.dialogRef.close({project_id: this.data.project_id, entity_description: this.entity_desc, entity_slot: entity_slot_details});
    } else {
      this.show_entity_error = true;
      return;
    }
  }

}

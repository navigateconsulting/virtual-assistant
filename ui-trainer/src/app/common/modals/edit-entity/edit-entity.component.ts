import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.scss']
})
export class EditEntityComponent implements OnInit {

  entity_name: string;
  entity_desc: string;
  entitySlotType: string;
  categorical_values: string;
  min_value: number;
  max_value: number;

  constructor(public dialogRef: MatDialogRef<EditEntityComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.entity_name = this.data.entity.entity;
    this.entity_desc = this.data.entity.entity_desc;
    this.entitySlotType = this.data.entity.entity_slot.type;
    if (this.entitySlotType === 'categorical') {
      this.categorical_values = this.data.entity.entity_slot.values.join(',');
    } else if (this.entitySlotType === 'float') {
      this.min_value = this.data.entity.entity_slot.values.min_value;
      this.max_value = this.data.entity.entity_slot.values.max_value;
    }
  }

  setEntitySlotType(event: any) {
    this.entitySlotType = event.target.innerText;
  }

  saveEntitySlotDetails() {
    let entity_details = {};
    if (this.entitySlotType === 'categorical') {
      // tslint:disable-next-line:max-line-length
      entity_details = {entity: this.entity_name, entity_desc: this.entity_desc, entity_slot: {type: this.entitySlotType, values: this.categorical_values.split(',')}};
    } else if (this.entitySlotType === 'float') {
      // tslint:disable-next-line:max-line-length
      entity_details = {entity: this.entity_name, entity_desc: this.entity_desc, entity_slot: {type: this.entitySlotType, values: {min_value: this.min_value, max_value: this.max_value}}};
    } else {
      entity_details = {entity: this.entity_name, entity_desc: this.entity_desc, entity_slot: {type: this.entitySlotType, values: []}};
    }
    this.dialogRef.close(entity_details);
  }

  removeEntity() {
    this.dialogRef.close('0');
  }

}

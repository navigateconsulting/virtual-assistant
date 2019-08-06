import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.scss']
})
export class EditEntityComponent implements OnInit {

  entity: any;
  entityName: string;
  entityDescription: string;
  entitySlotType: string;
  categorical_values: string;
  min_value: number;
  max_value: number;
  entityObjectId: string;
  appSource: string;

  constructor(public dialogRef: MatDialogRef<EditEntityComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.entity = this.data.entity;
    this.entityObjectId = this.data.entity._id.$oid;
    this.entityName = this.data.entity.entity_name;
    this.entityDescription = this.data.entity.entity_description;
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
    this.entity.entity_name = this.entityName;
    this.entity.entity_description = this.entityDescription;
    if (this.entitySlotType === 'categorical') {
      this.entity.entity_slot = {type: this.entitySlotType, values: this.categorical_values.split(',')};
    } else if (this.entitySlotType === 'float') {
      this.entity.entity_slot = {type: this.entitySlotType, values: {min_value: this.min_value, max_value: this.max_value}};
    } else {
      this.entity.entity_slot = {type: this.entitySlotType, values: [""]};
    }
    this.dialogRef.close(this.entity);
  }

  removeEntity() {
    this.dialogRef.close(this.entityObjectId);
  }

}

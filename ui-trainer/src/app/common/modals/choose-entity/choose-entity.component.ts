import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-choose-entity',
  templateUrl: './choose-entity.component.html',
  styleUrls: ['./choose-entity.component.scss']
})
export class ChooseEntityComponent implements OnInit {

  entity: any;
  entities: any;
  chosen_entity_value: string;
  entitiesControl = new FormControl();
  entityfilteredOptions: Observable<any[]>;

  constructor(public dialogRef: MatDialogRef<ChooseEntityComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.entity = this.data.selected_entity;
    this.entities = new Array<object>();
    if (this.entity === '') {
      this.entities = this.data.entities;
      this.entityfilteredOptions = this.entitiesControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    } else {
      this.entities.push(this.entity);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.entities.filter(option => option.entity_name.toLowerCase().includes(filterValue));
  }

  chooseEntity() {
    if (this.chosen_entity_value !== undefined && this.entity.entity_slot.type === 'categorical') {
      this.dialogRef.close({chosen_entity: this.entity.entity_name, chosen_entity_value: this.chosen_entity_value});
    } else if (this.chosen_entity_value === undefined && this.entity.entity_slot.type !== 'categorical') {
      this.dialogRef.close({chosen_entity: this.entity.entity_name, chosen_entity_value: ''});
    }
  }

  getEntityValue(entity_value: string) {
    this.entity = this.entities.filter((value) => {
      if (value.entity_name === entity_value) {
        return value;
      }
    })[0];
  }

}

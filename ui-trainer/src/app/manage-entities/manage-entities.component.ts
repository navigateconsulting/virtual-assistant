import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { AddEntityComponent } from '../common/modals/add-entity/add-entity.component';
import { EditEntityComponent } from '../common/modals/edit-entity/edit-entity.component';
import { MatDialog } from '@angular/material';
import { EntitiesDataService } from '../common/services/entities-data.service';

@Component({
  selector: 'app-manage-entities',
  templateUrl: './manage-entities.component.html',
  styleUrls: ['./manage-entities.component.scss']
})
export class ManageEntitiesComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  entities: any;

  constructor(public dialog: MatDialog,
              private entities_data: EntitiesDataService) { }

  ngOnInit() {
    this.entities_data.newEntity.subscribe((entities: any) => {
      this.entities = (entities !== '' && entities !== null) ? entities : [];
    });
  }

  addEntity(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our entity
    if ((value || '').trim()) {
      const dialogRef = this.dialog.open(AddEntityComponent, {
        width: '500px',
      });

      dialogRef.afterClosed().subscribe(entity_details => {
        if (Object.keys(entity_details).length !== 0) {
          // tslint:disable-next-line:max-line-length
          this.entities.push({entity: value.trim(), entity_desc: entity_details.entity_desc, entity_slot: entity_details.entity_slot_details});
          this.entities_data.saveEntitiesJson(this.entities.slice(0));
          this.updateEntitiesObject(this.entities);
        }
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  editEntity(entity: any) {
    const index = this.entities.indexOf(entity);
    const dialogRef = this.dialog.open(EditEntityComponent, {
      width: '500px',
      data: {entity: entity}
    });

    dialogRef.afterClosed().subscribe(entity_details => {
      if (entity_details !== '') {
        if (entity_details === '0') {
          this.entities.splice(index, 1);
        } else {
          this.entities[index] = entity_details;
        }
        this.entities_data.saveEntitiesJson(this.entities.slice(0));
        this.updateEntitiesObject(this.entities);
      }
    });
  }

  updateEntitiesObject(entities: any) {
    this.entities_data.changeEntity(entities);
  }
}

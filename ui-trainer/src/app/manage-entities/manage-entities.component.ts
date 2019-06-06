import { Component, OnInit, Input } from '@angular/core';
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
  show_success_error: boolean;
  success_error_class: string;
  success_error_type: string;
  success_error_message: string;

  @Input() projectObjectId: string;

  constructor(public dialog: MatDialog,
              private entities_service: EntitiesDataService) { }

  ngOnInit() {
    this.getEntities();
  }

  getEntities() {
    this.entities_service.createEntitiesRoom();
    this.entities_service.getEntities({project_id: this.projectObjectId}).subscribe(entities => {
      this.entities = entities;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.entities_service.getEntityAlerts().subscribe(entities => {
      this.showEntityAlerts(entities);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  addEntity(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our entity
    if ((value || '').trim()) {
      const dialogRef = this.dialog.open(AddEntityComponent, {
        width: '500px',
        data: {project_id: this.projectObjectId}
      });
      dialogRef.afterClosed().subscribe(entity_details => {
        if (entity_details) {
          if (Object.keys(entity_details).length !== 0) {
            entity_details['entity_name'] = value.trim();
            this.entities_service.createEntity(entity_details);
          }
        }
      });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  editEntity(entity: any) {
    const dialogRef = this.dialog.open(EditEntityComponent, {
      width: '500px',
      data: {entity: entity}
    });

    dialogRef.afterClosed().subscribe(entity_details => {
      if (entity_details) {
        if (typeof entity_details === 'string') {
          entity_details = {project_id: this.projectObjectId, object_id: entity_details};
          this.entities_service.deleteEntity(entity_details);
        } else {
          this.entities_service.editEntity(entity_details);
        }
      }
    });
  }

  showEntityAlerts(res: any) {
    if (res.status === 'Error') {
      this.success_error_class = 'danger';
    } else if (res.status === 'Success') {
      this.success_error_class = 'success';
    }
    this.success_error_type = res.status;
    this.success_error_message = res.message;
    this.show_success_error = true;
    setTimeout(() => {
      this.show_success_error = false;
    }, 2000);
  }
}

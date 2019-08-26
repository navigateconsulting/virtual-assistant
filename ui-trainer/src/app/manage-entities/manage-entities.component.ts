import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { AddEntityComponent } from '../common/modals/add-entity/add-entity.component';
import { EditEntityComponent } from '../common/modals/edit-entity/edit-entity.component';
import { MatDialog } from '@angular/material';
import { MatInput } from '@angular/material/input';
import { EntitiesDataService } from '../common/services/entities-data.service';
import { NotificationsService } from '../common/services/notifications.service';
import { Subscription } from 'rxjs';

declare var adjustEntityScroll: Function;

@Component({
  selector: 'app-manage-entities',
  templateUrl: './manage-entities.component.html',
  styleUrls: ['./manage-entities.component.scss']
})
export class ManageEntitiesComponent implements OnInit, OnDestroy {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  entities: Array<object>;
  show_success_error: boolean;
  success_error_class: string;
  success_error_type: string;
  success_error_message: string;

  @Input() projectObjectId: string;
  @ViewChild('entityName') entityNameInput: MatInput;

  private subscription: Subscription;

  constructor(public dialog: MatDialog,
              private entities_service: EntitiesDataService,
              public notificationsService: NotificationsService) { }

  ngOnInit() {
    this.entities = [];
    this.subscription = new Subscription();
    this.getEntities();
    adjustEntityScroll();
    this.entityNameInput.focus();
  }

  getEntities() {
    this.entities_service.createEntitiesRoom();
    this.entities_service.getEntities({project_id: this.projectObjectId}).subscribe(entities => {
      this.entities = entities;
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));

    this.subscription.add(this.entities_service.getEntityAlerts().subscribe(entities => {
      this.notificationsService.showToast(entities);
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification')));
  }

  addEntity(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // tslint:disable-next-line: no-shadowed-variable
    const checkPrevEntity = this.entities.filter((entity) => {
      if (entity['entity_name'] === value.trim()) {
        return entity;
      }
    });
    if (checkPrevEntity.length === 0) {
      // Add our entity
      if ((value || '').trim()) {
        const dialogRef = this.dialog.open(AddEntityComponent, {
          width: '500px',
          data: {
            project_id: this.projectObjectId,
            entity_name: value,
          }
        });
        dialogRef.afterClosed().subscribe(entity_details => {
          if (entity_details) {
            if (Object.keys(entity_details).length !== 0) {
              entity_details['entity_name'] = value.trim();
              this.entities_service.createEntity(entity_details);
              adjustEntityScroll();
            }
          }
          input.focus();
        });
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
    } else {
      this.notificationsService.showToast({status: 'Error', message: 'Entity Already Exists'});
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.dialog.closeAll();
  }
}

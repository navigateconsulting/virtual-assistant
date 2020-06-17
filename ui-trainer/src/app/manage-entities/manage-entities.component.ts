import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { AddEntityComponent } from '../common/modals/add-entity/add-entity.component';
import { EditEntityComponent } from '../common/modals/edit-entity/edit-entity.component';
import { MatDialog } from '@angular/material';
import { MatInput } from '@angular/material/input';
import { NotificationsService } from '../common/services/notifications.service';
import { ApiService } from '../common/services/apis.service';

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
  entities_backup: Array<object>;
  show_success_error: boolean;
  success_error_class: string;
  success_error_type: string;
  success_error_message: string;

  @Input() projectObjectId: string;
  @ViewChild('entityName') entityNameInput: MatInput;

  filterEntityText = '';

  constructor(public dialog: MatDialog,
              public apiService: ApiService,
              public notificationsService: NotificationsService) { }

  ngOnInit() {
    this.entities = this.entities_backup = new Array<object>();
    this.getEntities();
    adjustEntityScroll();
    this.entityNameInput.focus();
  }

  getEntities() {
    this.apiService.requestEntities(this.projectObjectId).subscribe(entities => {
      if (entities) {
        this.entities = this.entities_backup = entities;
        this.applyEntitiesFilter(this.filterEntityText);
      }
    },
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification'));
  }

  addEntity(event: MatChipInputEvent): void {
    this.entities = this.entities_backup;
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
              this.apiService.createEntity(entity_details, this.projectObjectId).subscribe(result => {
                if (result) {
                  this.notificationsService.showToast(result);
                  this.forceReload();
                }
              },
              err => console.error('Observer got an error: ' + err),
              () => console.log('Observer got a complete notification'));
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
          this.apiService.deleteEntity(entity_details, this.projectObjectId).subscribe(result => {
            if (result) {
              this.notificationsService.showToast(result);
              this.forceReload();
            }
          },
          err => console.error('Observer got an error: ' + err),
          () => console.log('Observer got a complete notification'));
        } else {
          this.apiService.editEntity(entity_details, this.projectObjectId).subscribe(result => {
            if (result) {
              this.notificationsService.showToast(result);
              this.forceReload();
            }
          },
          err => console.error('Observer got an error: ' + err),
          () => console.log('Observer got a complete notification'));
        }
      }
    });
  }

  applyEntitiesFilter(filterValue: string) {
    this.entities = this.entities_backup;
    this.entities = this.entities.filter((value) => {
      if (value['entity_name'].includes(filterValue.trim()) ||
          value['entity_name'].toLowerCase().includes(filterValue.trim()) ||
          value['entity_name'].toUpperCase().includes(filterValue.trim())) {
        return value;
      }
    });
  }

  forceReload() {
    this.apiService.forceEntitiesCacheReload('reset');
    this.getEntities();
  }

  ngOnDestroy(): void {
    this.apiService.forceEntitiesCacheReload('finish');
    this.dialog.closeAll();
  }
}

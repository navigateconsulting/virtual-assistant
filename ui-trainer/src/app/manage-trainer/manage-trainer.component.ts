import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-manage-trainer',
  templateUrl: './manage-trainer.component.html',
  styleUrls: ['./manage-trainer.component.scss']
})
export class ManageTrainerComponent implements OnInit {

  setComponent: string;
  projectObjectId: string;
  domainObjectId: string;
  irsObjectId: string;
  breadcrumb_arr: Array<string>;
  breadcrumb_string: string;
  propertyPanel: string;
  showPropertyPanel: boolean;

  @ViewChild('entitiesSidenav') public entitiesSidenav: MatSidenav;

  constructor() { }

  ngOnInit() {
    this.breadcrumb_arr = new Array<string>();
    this.breadcrumb_arr.push('Home');
    this.breadcrumb_string = this.breadcrumb_arr.join('/');
    this.setComponent = 'manage-projects';
    this.showPropertyPanel = false;
  }

  projectSelected($event: any) {
    this.projectObjectId = $event;
    this.showPropertyPanel = true;
    this.setComponent = 'manage-domains';
  }

  domainSelected($event: any) {
    this.domainObjectId = $event;
    this.setComponent = 'manage-irs';
  }

  irsSelected($event: any) {
    if ($event.type === 'intent') {
      this.irsObjectId = $event.object_id;
      this.setComponent = 'manage-intents';
    } else if ($event.type === 'response') {
      this.irsObjectId = $event.object_id;
      this.setComponent = 'manage-responses';
    }
  }

  toggleEntities() {
    this.propertyPanel = 'entities';
    this.entitiesSidenav.toggle();
  }

  openPropertyPanelComponent(propertyPanelComponent: string) {
    this.propertyPanel = propertyPanelComponent;
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { Breadcrumb } from '../common/models/breadcrumb';
import { ManageEntitiesComponent } from '../manage-entities/manage-entities.component';
import { environment } from '../../environments/environment';
import { HeaderService } from '../common/services/header.service';

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
  breadcrumb_arr: Array<Breadcrumb>;
  propertyPanel: string;
  showPropertyPanel: boolean;
  loadTryNow: boolean;
  appSource: string;

  @ViewChild('entitiesSidenav') public entitiesSidenav: MatSidenav;
  @ViewChild('entityComponent') public entityComponent: ManageEntitiesComponent;

  constructor(private router: Router,
              private headerService: HeaderService) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.headerService.changeHeaderApplication('deploy');
    this.breadcrumb_arr = new Array<Breadcrumb>();
    this.breadcrumb_arr.push({breadcrumb_name: 'Projects', breadcrumb_stub: {}, breadcrumb_type: 'root'});
    this.setComponent = 'manage-projects';
    this.showPropertyPanel = false;
    this.loadTryNow = false;
  }

  projectSelected($event: any) {
    // tslint:disable-next-line: max-line-length
    this.breadcrumb_arr.push({breadcrumb_name: $event.projectStub.project_name, breadcrumb_stub: $event.projectStub, breadcrumb_type: 'project'});
    this.projectObjectId = $event.projectStub._id.$oid;
    this.showPropertyPanel = true;
    if ($event.component === 'manage-domains') {
      this.setComponent = 'manage-domains';
    } else if ($event.component === 'try-now') {
      this.loadTryNow = true;
      this.router.navigate(['/home/trainer/try-now']);
    }
  }

  domainSelected($event: any) {
    this.breadcrumb_arr.push({breadcrumb_name: $event.domain_name, breadcrumb_stub: $event, breadcrumb_type: 'domain'});
    this.domainObjectId = $event._id.$oid;
    this.setComponent = 'manage-irs';
  }

  irsSelected($event: any) {
    this.irsObjectId = $event.irs_object._id.$oid;
    if ($event.type === 'intent') {
      // tslint:disable-next-line: max-line-length
      this.breadcrumb_arr.push({breadcrumb_name: $event.irs_object.intent_name, breadcrumb_stub: $event.irs_object, breadcrumb_type: 'intent'});
      this.setComponent = 'manage-intents';
    } else if ($event.type === 'response') {
      // tslint:disable-next-line: max-line-length
      this.breadcrumb_arr.push({breadcrumb_name: $event.irs_object.response_name, breadcrumb_stub: $event.irs_object, breadcrumb_type: 'response'});
      this.setComponent = 'manage-responses';
    } else if ($event.type === 'story') {
      // tslint:disable-next-line: max-line-length
      this.breadcrumb_arr.push({breadcrumb_name: $event.irs_object.story_name, breadcrumb_stub: $event.irs_object, breadcrumb_type: 'story'});
      this.setComponent = 'manage-stories';
    }
  }

  toggleEntities() {
    this.propertyPanel = 'entities';
    this.entitiesSidenav.toggle();
    if (this.entityComponent !== undefined) {
      this.entityComponent.ngOnInit();
    }
  }

  closeEntityPanel() {
    if (this.entityComponent !== undefined) {
      this.entityComponent.ngOnDestroy();
      this.entityComponent = undefined;
    }
  }

  openPropertyPanelComponent(propertyPanelComponent: string) {
    this.propertyPanel = propertyPanelComponent;
  }

  updateBreadcrumb(breadCrumbObject: any, breadCrumbIndex: number) {
    this.breadcrumb_arr = this.breadcrumb_arr.slice(0, breadCrumbIndex);
    if (breadCrumbObject.breadcrumb_type === 'root') {
      this.breadcrumb_arr.push({breadcrumb_name: 'Projects', breadcrumb_stub: {}, breadcrumb_type: 'root'});
      this.setComponent = 'manage-projects';
      this.showPropertyPanel = false;
    } else if (breadCrumbObject.breadcrumb_type === 'project') {
      this.projectSelected({projectStub: breadCrumbObject.breadcrumb_stub, component: 'manage-domains'});
    } else if (breadCrumbObject.breadcrumb_type === 'domain') {
      this.domainSelected(breadCrumbObject.breadcrumb_stub);
    // tslint:disable-next-line: max-line-length
    } else if (breadCrumbObject.breadcrumb_type === 'intent') {
      this.irsSelected({irs_object: breadCrumbObject.breadcrumb_stub, type: 'intent'});
    } else if (breadCrumbObject.breadcrumb_type === 'response') {
      this.irsSelected({irs_object: breadCrumbObject.breadcrumb_stub, type: 'response'});
    } else if (breadCrumbObject.breadcrumb_type === 'story') {
      this.irsSelected({irs_object: breadCrumbObject.breadcrumb_stub, type: 'story'});
    }
  }

}

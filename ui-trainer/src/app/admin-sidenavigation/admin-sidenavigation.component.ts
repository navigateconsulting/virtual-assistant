import { Component, OnInit, ViewChild } from '@angular/core';

import { SideDrawerService } from '../common/services/side-drawer.service';

import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-admin-sidenavigation',
  templateUrl: './admin-sidenavigation.component.html',
  styleUrls: ['./admin-sidenavigation.component.scss']
})
export class AdminSidenavigationComponent implements OnInit {

  @ViewChild('sidedraw_admin') public sideDrawer: MatDrawer;
  setDrawerIcon: string;
  setComponent: string;

  constructor(public sideDrawerService: SideDrawerService) { }

  ngOnInit() {
    this.sideDrawerService.setSideDrawer(this.sideDrawer);
    this.sideDrawerService.close();
    this.sideDrawerService.drawerIconState = 'open';
    this.setComponent = 'manage-domains';
  }

  closeSideDrawer() {
    this.setDrawerIcon = 'open';
    this.sideDrawerService.close();
    this.sideDrawerService.setDrawerValue('open');
  }

  setCloseDrawerValue(state: string) {
    this.setDrawerIcon = state;
  }

  openMatDrawerContent(component: string) {
    this.setComponent = component;
    if (component === 'manage-domains') {
      this.closeSideDrawer();
    }
  }

}

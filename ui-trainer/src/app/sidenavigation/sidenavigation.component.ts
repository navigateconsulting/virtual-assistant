import { Component, OnInit, ViewChild, Input } from '@angular/core';

// import { HeaderComponent } from '../common/header/header.component';

import { SideDrawerService } from '../common/services/side-drawer.service';

import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-sidenavigation',
  templateUrl: './sidenavigation.component.html',
  styleUrls: ['./sidenavigation.component.scss']
})
export class SidenavigationComponent implements OnInit {

  @Input() agent_details: string;
  @ViewChild('sidedraw_agent') public sideDrawer: MatDrawer;
  setDrawerIcon: string;
  // private headerComponent: HeaderComponent;

  constructor(public sideDrawerService: SideDrawerService) { }

  ngOnInit() {
    this.sideDrawerService.setSideDrawer(this.sideDrawer);
    this.sideDrawerService.open();
    this.sideDrawerService.drawerIconState = 'close';
  }

  closeSideDrawer() {
    this.setDrawerIcon = 'open';
    this.sideDrawerService.close();
    this.sideDrawerService.setDrawerValue('open');
  }

  setCloseDrawerValue(state: string) {
    this.setDrawerIcon = state;
  }
}

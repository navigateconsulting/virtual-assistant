import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SideDrawerService {

  private sideDrawer: MatDrawer;
  drawerIconState: string;

  constructor() { }

  public setSideDrawer(sideDrawer: MatDrawer) {
    this.sideDrawer = sideDrawer;
  }

  public open() {
    return this.sideDrawer.open();
  }

  public close() {
    return this.sideDrawer.close();
  }

  public toggle(): void {
    this.sideDrawer.toggle();
  }

  public setDrawerValue(state: string): void {
    this.drawerIconState = state;
  }
}

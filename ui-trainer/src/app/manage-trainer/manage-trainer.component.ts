import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-trainer',
  templateUrl: './manage-trainer.component.html',
  styleUrls: ['./manage-trainer.component.scss']
})
export class ManageTrainerComponent implements OnInit {

  setComponent: string;
  projectObjectId: string;
  breadcrumb_arr: Array<string>;
  breadcrumb_string: string;

  constructor() { }

  ngOnInit() {
    this.breadcrumb_arr = new Array<string>();
    this.breadcrumb_arr.push('Home');
    this.breadcrumb_string = this.breadcrumb_arr.join('/');
    this.setComponent = 'manage-projects';
  }

  projectSelected($event: any) {
    this.projectObjectId = $event;
    this.setComponent = 'manage-domains';
  }

}

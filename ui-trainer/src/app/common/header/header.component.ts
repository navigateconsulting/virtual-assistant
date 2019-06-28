import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showTrainerOrDeploy: string;

  constructor(private headerService: HeaderService) { }

  ngOnInit() {
    this.showTrainerOrDeploy = 'both';
    this.headerService.invokeEvent.subscribe(value => {
      if (value) {
        this.showTrainerOrDeploy = value;
      } else {
        this.showTrainerOrDeploy = 'both';
      }
    });
  }
}

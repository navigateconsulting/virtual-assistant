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

  constructor(private router: Router,
              private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.invokeEvent.subscribe(value => {
      if (value) {
        this.showTrainerOrDeploy = value;
      } else {
        this.showTrainerOrDeploy = 'both';
      }
    });
  }

  changeApplication() {
    if (this.router.url.includes('trainer')) {
      this.showTrainerOrDeploy = 'deploy';
    } else if (this.router.url.includes('deploy')) {
      this.showTrainerOrDeploy = 'trainer';
    } else {
      this.showTrainerOrDeploy = 'both';
    }
  }
}

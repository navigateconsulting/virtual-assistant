import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showTrainerOrDeploy: string;
  appSource: string;

  constructor(private headerService: HeaderService) { }

  ngOnInit() {
    this.appSource = environment.app_source;
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

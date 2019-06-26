import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showTrainerOrDeploy: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.changeApplication();
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

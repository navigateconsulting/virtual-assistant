import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from './common/services/auth.service';
import { environment } from '../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'eva-chatbot-app';
  loggedIn = false;

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private router: Router, public authService: AuthService) {
    this.matIconRegistry.addSvgIcon(
      'project',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/project.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/edit.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'delete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/delete.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'copy',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/copy.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'try-now',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/try-now.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'domain',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/domain.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'intent',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/intent.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'response',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/response.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'story',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/story.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'deploy',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/deploy.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'error',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/error.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'menu',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/menu.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'help',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/help.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'profile',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/profile.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'trainer',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/trainer.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'deleteDis',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/delete-disabled.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'editDis',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/edit-disabled.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'trainer-loader',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/trainer-loader.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'trainer-error',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/trainer-error.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'app-properties',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/app-properties.svg')
    );
  }

  ngOnInit() {
    if (localStorage.getItem('jwt_token') === null || localStorage.getItem('jwt_token') === 'no_token') {
      if (this.authService.checkValidToken(window.location.href.split('/').pop())) {
        this.authService.setToken(window.location.href.split('/').pop());
        this.checkTokenValidity();
      } else {
        this.authService.setToken('no_token');
        this.checkTokenValidity();
      }
    } else {
      this.checkTokenValidity();
    }
  }

  checkTokenValidity() {
    if (!this.authService.isTokenExpired()) {
      this.loggedIn = true;
      if (localStorage.getItem('jwt_token') === 'no_token' && window.location.href.split('/').pop() !== 'applications' && window.location.href.split('/').pop() !== 'home' && window.location.href.split('/').pop() !== '') {
        sessionStorage.setItem('appParamExists', 'Y');
        this.router.navigate(['applications', { app : window.location.href.split('/').pop() }]);
      } else {
        sessionStorage.setItem('appParamExists', 'N');
        this.router.navigate(['applications']);
      }
    } else {
      this.callParentApp();
    }
  }

  callParentApp () {
    localStorage.clear();
    let url = environment.PARENT_APP_URL;   
    window.open(url, '_self');
  }
}

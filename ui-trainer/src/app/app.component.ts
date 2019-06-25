import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'eva-chatbot-app';

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
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
  }
}

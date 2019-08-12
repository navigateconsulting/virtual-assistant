import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ManageTrainerComponent } from '../app/manage-trainer/manage-trainer.component';
import { ApplicationsComponent } from '../app/applications/applications.component';
import { TryNowComponent } from '../app/try-now/try-now.component';
import { DeployComponent } from '../app/deploy/deploy.component';
import { environment } from '../environments/environment';

const routes: Routes = [
      { path: '', redirectTo: 'home/trainer', pathMatch: 'full' },
      // { path: 'login', component: LoginComponent },
      // { path: 'applications', component: ApplicationsComponent },
      { path: 'home', component: HomeComponent, children: [
        { path: 'trainer', component: ManageTrainerComponent, children: [
          { path: 'try-now', component: TryNowComponent },
        ] },
        { path: 'deploy', component: DeployComponent },
      ] },
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

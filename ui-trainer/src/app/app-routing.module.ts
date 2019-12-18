import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ManageTrainerComponent } from '../app/manage-trainer/manage-trainer.component';
import { TryNowComponent } from '../app/try-now/try-now.component';
import { DeployComponent } from '../app/deploy/deploy.component';
import { ManageActionsComponent } from '../app/manage-actions/manage-actions.component';

const routes: Routes = [
      { path: '', redirectTo: 'home/trainer', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, children: [
        { path: 'trainer', component: ManageTrainerComponent, children: [
          { path: 'try-now', component: TryNowComponent },
        ] },
        { path: 'deploy', component: DeployComponent },
        { path: 'actions', component: ManageActionsComponent },
      ] },
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

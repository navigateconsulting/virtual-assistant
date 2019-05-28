import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ManageTrainerComponent } from '../app/manage-trainer/manage-trainer.component';
import { SocketIoComponent } from './socket-io/socket-io.component';
import { ApplicationsComponent } from '../app/applications/applications.component';
import { TryNowComponent } from '../app/try-now/try-now.component';

const routes: Routes = [
  { path: '', component: HomeComponent, children: [
    { path: 'trainer', component: ManageTrainerComponent, children: [
      { path: 'try-now', component: TryNowComponent}
    ] }
  ] },
  { path: 'socket', component: SocketIoComponent },
  { path: 'applications', component: ApplicationsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

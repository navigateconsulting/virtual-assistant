import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ManageTrainerComponent } from '../app/manage-trainer/manage-trainer.component';
import { TryNowComponent } from '../app/try-now/try-now.component';
import { DeployComponent } from '../app/deploy/deploy.component';
import { ManageActionsComponent } from '../app/manage-actions/manage-actions.component';
import { ConversationsComponent } from '../app/conversations/conversations.component';
import { ConversationChatComponent } from '../app/conversation-chat/conversation-chat.component';
import { ApplicationsComponent } from '../app/applications/applications.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
      { path: 'app/:apptype/:atoken', component: AppComponent },
      // { path: '', redirectTo: 'home/trainer', pathMatch: 'full' },
      { path: 'applications', component: ApplicationsComponent, canActivate: [AuthGuard] },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
        { path: 'trainer', component: ManageTrainerComponent, children: [
          { path: 'try-now', component: TryNowComponent },
        ] },
        { path: 'deploy', component: DeployComponent },
        { path: 'actions', component: ManageActionsComponent },
        { path: 'conversations', component: ConversationsComponent },
        { path: 'conversations/:conversation_id', component: ConversationChatComponent },
      ] },
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

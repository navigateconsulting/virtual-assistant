import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HeaderComponent } from './common/header/header.component';
import { HomeComponent } from './home/home.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { ManageDomainsComponent } from './manage-domains/manage-domains.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ManageEntitiesComponent } from './manage-entities/manage-entities.component';
import { ManageIntentsComponent } from './manage-intents/manage-intents.component';
import { AddEntityComponent } from './common/modals/add-entity/add-entity.component';
import { EditEntityComponent } from './common/modals/edit-entity/edit-entity.component';
import { ChooseEntityComponent } from './common/modals/choose-entity/choose-entity.component';
import { ManageResponsesComponent } from './manage-responses/manage-responses.component';
import { ManageStoriesComponent } from './manage-stories/manage-stories.component';
import { AddEntityValueComponent } from './common/modals/add-entity-value/add-entity-value.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';
import { ManageTrainerComponent } from './manage-trainer/manage-trainer.component';
import { AddProjectComponent } from './common/modals/add-project/add-project.component';
import { EditProjectComponent } from './common/modals/edit-project/edit-project.component';
import { DeleteProjectComponent } from './common/modals/delete-project/delete-project.component';
import { CopyProjectComponent } from './common/modals/copy-project/copy-project.component';
import { AddDomainComponent } from './common/modals/add-domain/add-domain.component';
import { DeleteDomainComponent } from './common/modals/delete-domain/delete-domain.component';
import { EditDomainComponent } from './common/modals/edit-domain/edit-domain.component';
import { ManageIrsComponent } from './manage-irs/manage-irs.component';
import { AddIntentComponent } from './common/modals/add-intent/add-intent.component';
import { DeleteIntentComponent } from './common/modals/delete-intent/delete-intent.component';
import { EditIntentComponent } from './common/modals/edit-intent/edit-intent.component';
import { AddResponseComponent } from './common/modals/add-response/add-response.component';
import { EditResponseComponent } from './common/modals/edit-response/edit-response.component';
import { DeleteResponseComponent } from './common/modals/delete-response/delete-response.component';
import { AddStoryComponent } from './common/modals/add-story/add-story.component';
import { EditStoryComponent } from './common/modals/edit-story/edit-story.component';
import { DeleteStoryComponent } from './common/modals/delete-story/delete-story.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { TryNowComponent } from './try-now/try-now.component';
import { DeployComponent } from './deploy/deploy.component';
import { DeployModelComponent } from './common/modals/deploy-model/deploy-model.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSpinner } from '@angular/material';
import { SpinnerComponent } from './spinner/spinner.component';
import { ModelErrorComponent } from './common/modals/model-error/model-error.component';
import { TryNowLoadComponent } from './try-now-load/try-now-load.component';
import { ConfirmRefreshComponent } from './common/modals/confirm-refresh/confirm-refresh.component';
import { ManageActionsComponent } from './manage-actions/manage-actions.component';
import { AddActionComponent } from './common/modals/add-action/add-action.component';
import { EditActionComponent } from './common/modals/edit-action/edit-action.component';
import { DeleteActionComponent } from './common/modals/delete-action/delete-action.component';
import { ConversationsComponent } from './conversations/conversations.component';
import { ConversationChatComponent } from './conversation-chat/conversation-chat.component';
import { ApplicationsComponent } from './applications/applications.component';
import { AppPropComponent } from './common/modals/app-prop/app-prop.component';

import { AuthGuard } from './auth.guard';
import { AuthService } from './common/services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ManageDomainsComponent,
    ManageEntitiesComponent,
    ManageIntentsComponent,
    AddEntityComponent,
    EditEntityComponent,
    ChooseEntityComponent,
    ManageResponsesComponent,
    ManageStoriesComponent,
    AddEntityValueComponent,
    ManageProjectsComponent,
    ManageTrainerComponent,
    AddProjectComponent,
    EditProjectComponent,
    DeleteProjectComponent,
    CopyProjectComponent,
    AddDomainComponent,
    DeleteDomainComponent,
    EditDomainComponent,
    ManageIrsComponent,
    AddIntentComponent,
    DeleteIntentComponent,
    EditIntentComponent,
    AddResponseComponent,
    EditResponseComponent,
    DeleteResponseComponent,
    AddStoryComponent,
    EditStoryComponent,
    DeleteStoryComponent,
    TryNowComponent,
    DeployComponent,
    DeployModelComponent,
    SpinnerComponent,
    ModelErrorComponent,
    TryNowLoadComponent,
    ConfirmRefreshComponent,
    ManageActionsComponent,
    AddActionComponent,
    EditActionComponent,
    DeleteActionComponent,
    ConversationsComponent,
    ConversationChatComponent,
    ApplicationsComponent,
    AppPropComponent,
  ],
  entryComponents: [
    AddEntityComponent,
    EditEntityComponent,
    ChooseEntityComponent,
    AddEntityValueComponent,
    AddProjectComponent,
    EditProjectComponent,
    DeleteProjectComponent,
    CopyProjectComponent,
    AddDomainComponent,
    DeleteDomainComponent,
    EditDomainComponent,
    AddIntentComponent,
    DeleteIntentComponent,
    EditIntentComponent,
    AddResponseComponent,
    EditResponseComponent,
    DeleteResponseComponent,
    AddStoryComponent,
    EditStoryComponent,
    DeleteStoryComponent,
    DeployModelComponent,
    SpinnerComponent,
    ModelErrorComponent,
    TryNowLoadComponent,
    ConfirmRefreshComponent,
    AddActionComponent,
    EditActionComponent,
    DeleteActionComponent,
    AppPropComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    OverlayModule,
    ToastrModule.forRoot()
  ],
  providers: [{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}, 
    AuthGuard,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-story',
  templateUrl: './edit-story.component.html',
  styleUrls: ['./edit-story.component.scss']
})
export class EditStoryComponent implements OnInit {

  editStoryForm: FormGroup;
  appSource: string;

  constructor(public dialogRef: MatDialogRef<EditStoryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.editStoryForm = new FormGroup({
      storyName: new FormControl({value: this.data.storyName, disabled: true}, Validators.required),
      storyDescription: new FormControl(this.data.storyDescription, Validators.required)
    });
  }

  closeDialog() {
    if (this.editStoryForm.valid) {
      this.dialogRef.close({
        project_id: this.data.projectObjectId,
        domain_id: this.data.domainObjectId,
        object_id: this.data.storyObjectId,
        story_name: this.data.storyName,
        story_description: this.editStoryForm.value.storyDescription
      });
    }
  }

}

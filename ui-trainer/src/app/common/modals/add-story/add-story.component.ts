import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-story',
  templateUrl: './add-story.component.html',
  styleUrls: ['./add-story.component.scss']
})
export class AddStoryComponent implements OnInit {

  newStoryForm: FormGroup;
  @ViewChild('storyName') storyNameInput: MatInput;
  appSource: string;

  constructor(public dialogRef: MatDialogRef<AddStoryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.appSource = environment.app_source;
    this.newStoryForm = new FormGroup({
      storyName: new FormControl('', Validators.required),
      storyDescription: new FormControl('', Validators.required)
    });
    this.storyNameInput.focus();
  }

  closeDialog() {
    if (this.newStoryForm.valid) {
      this.dialogRef.close({
        project_id: this.data.projectObjectId,
        domain_id: this.data.domainObjectId,
        story_name: this.newStoryForm.value.storyName,
        story_description: this.newStoryForm.value.storyDescription
      });
    }
  }

}

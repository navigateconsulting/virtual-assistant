import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-story',
  templateUrl: './add-story.component.html',
  styleUrls: ['./add-story.component.scss']
})
export class AddStoryComponent implements OnInit {

  newStoryForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddStoryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.newStoryForm = new FormGroup({
      storyName: new FormControl('', Validators.required),
      storyDescription: new FormControl('', Validators.required)
    });
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

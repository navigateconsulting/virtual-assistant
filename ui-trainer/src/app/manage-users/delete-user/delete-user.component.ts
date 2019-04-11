import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { DeleteUserService } from '../../common/services/delete-user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  username: string;
  input_username: string;
  deleteUserForm: FormGroup;
  submitted: boolean;
  validate_username: boolean;
  update_id: any;

  constructor(public dialogRef: MatDialogRef<DeleteUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              public deleteUserService: DeleteUserService) { }

  ngOnInit() {
    this.username = this.data.username;
    this.deleteUserForm = this.formBuilder.group({
      inp_username: new FormControl('', [Validators.required]),
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.deleteUserForm.controls; }

  closeDialog() {
    this.dialogRef.close(this.update_id);
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.deleteUserForm.invalid) {
      return;
    } else {
      if (this.input_username !== this.username) {
        this.validate_username = false;
      } else {
        this.validate_username = true;
        const delete_user_details = {username: this.username};
        this.deleteUserService.delete_existing_user(delete_user_details)
        .subscribe(
          response => {
            this.update_id = response;
            this.closeDialog();
          },
        );
      }
    }
  }

}

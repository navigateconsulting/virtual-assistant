import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { CreateUserService } from '../../common/services/create-user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  createUserForm: FormGroup;
  first_name: string;
  last_name: string;
  display_name: string;
  email_id: string;
  user_name: string;
  password_setup_var: string;
  show_manual_pass_create: boolean;
  submitted: boolean;
  validate_checkbox: boolean;
  role_arr: number[] = [];
  agent_arr: number[] = [];
  validate_selectbox: boolean;
  insert_id: any;

  allAgents: any;

  constructor(public dialogRef: MatDialogRef<CreateUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              public createUserService: CreateUserService) { }

  ngOnInit() {
    this.allAgents = this.data.agents;
    this.createUserForm = this.formBuilder.group({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      displayname: new FormControl('', []),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.createUserForm.controls; }

  closeDialog() {
    this.dialogRef.close(this.insert_id);
  }

  setPassVar() {
    this.show_manual_pass_create = (this.password_setup_var === 'create_password_manually') ? true : false;
  }

  setSameAsEmail(event: any) {
    console.log(event);
    if (event.checked) {
      this.user_name = this.email_id;
    } else {
      this.user_name = '';
    }
  }

  addRoleToArr(event: any) {
    const role_id = event.source.id.split('_')[1];
    if (event.checked) {
      this.role_arr.push(role_id);
    } else {
      const index = this.role_arr.indexOf(role_id, 0);
      if (index > -1) {
        this.role_arr.splice(index, 1);
      }
    }
    this.validate_checkbox = false;
  }

  addAgentsToArr(event: any) {
    console.log(event);
    const agent_id = event.source.id.split('_')[1];
    if (event.source._selected) {
      this.agent_arr.push(agent_id);
    } else {
      const index = this.agent_arr.indexOf(agent_id, 0);
      if (index > -1) {
        this.agent_arr.splice(index, 1);
      }
    }
    console.log(this.agent_arr);
    this.validate_selectbox = false;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.createUserForm.invalid) {
      if (this.role_arr.length > 0) {
        this.validate_checkbox = false;
      } else {
        this.validate_checkbox = true;
      }
      if (this.agent_arr.length > 0) {
        this.validate_selectbox = false;
      } else {
        this.validate_selectbox = true;
      }
      return;
    } else {
      const new_user_details = {
        firstname: this.first_name,
        lastname: this.last_name,
        displayname: this.display_name,
        email: this.email_id,
        username: this.user_name,
        roles: this.role_arr,
        agents: this.agent_arr
      };
      this.createUserService.add_new_user(new_user_details)
      .subscribe(
        response => {
          this.insert_id = response;
          this.closeDialog();
        },
      );
    }
  }

}

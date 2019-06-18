import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { QueryUserService } from '../../common/services/query-user.service';
import { CreateUserService } from '../../common/services/create-user.service';
import { UpdateUserService } from '../../common/services/update-user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {

  user_id: number;
  username: string;
  firstname: string;
  lastname: string;
  displayname: string;
  email: string;
  role: string;
  agent: string;
  role_arr: any;
  agent_arr: any;
  reset_password: boolean;
  add_agent_val: boolean;
  add_domain_val: boolean;
  roles_dropdownList: any;
  roles_selectedItems = [];
  roles_dropdownSettings = {};
  agents_dropdownList: any;
  agents_selectedItems = [];
  agents_dropdownSettings = {};
  showRolesMultSelect: boolean;
  showAgentsMultSelect: boolean;

  constructor(public dialogRef: MatDialogRef<UpdateUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public queryUserService: QueryUserService,
              public createUserService: CreateUserService,
              public updateUserService: UpdateUserService) { }

  ngOnInit() {
    this.user_id = this.data.user_id;
    this.username = this.data.username;
    this.firstname = this.data.name.split(' ')[0];
    this.lastname = this.data.name.split(' ')[1];
    this.displayname = this.data.displayname;
    this.email = this.data.email;
    this.role = this.data.role.split(',');
    this.agent = this.data.agent.split(',');
    this.reset_password = false;
    this.add_agent_val = false;
    this.add_domain_val = false;
    this.showRolesMultSelect = false;
    this.showAgentsMultSelect = false;
    this.setRolesDropdown();
    this.setAgentsDropdown();
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  setRolesDropdown() {
    const roles_details = {where_cond: true};
    this.queryUserService.get_all_roles(roles_details)
      .subscribe(
        response => {
          this.roles_dropdownList = response;
          for (let i = 0; i < this.role.length; i++) {
            Object.keys(this.roles_dropdownList).forEach(key => {
              if (this.role[i] === this.roles_dropdownList[key].role_name) {
                this.roles_selectedItems.push({
                  role_id: this.roles_dropdownList[key].role_id,
                  role_name: this.roles_dropdownList[key].role_name
                });
              }
            });
          }
          this.roles_dropdownSettings = {
            singleSelection: false,
            idField: 'role_id',
            textField: 'role_name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
          };
          this.showRolesMultSelect = true;
        },
      );
  }

  setAgentsDropdown() {
    const agent_details = {where_cond: true};
    this.createUserService.get_all_agents(agent_details)
      .subscribe(
        response => {
          this.agents_dropdownList = response;
          for (let i = 0; i < this.agent.length; i++) {
            Object.keys(this.agents_dropdownList).forEach(key => {
              if (this.agent[i] === this.agents_dropdownList[key].agent_name) {
                this.agents_selectedItems.push({
                  agent_id: this.agents_dropdownList[key].agent_id,
                  agent_name: this.agents_dropdownList[key].agent_name
                });
              }
            });
          }
          this.agents_dropdownSettings = {
            singleSelection: false,
            idField: 'agent_id',
            textField: 'agent_name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
          };
          this.showAgentsMultSelect = true;
        },
      );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  resetPassVar() {
    this.reset_password = (this.reset_password === false) ? true : false;
  }

  addAgent() {
    this.add_agent_val = true;
  }

  addDomain() {
    this.add_domain_val = true;
  }

  updateDetails() {
    this.role_arr = [];
    this.agent_arr = [];
    for (let i = 0; i < this.roles_selectedItems.length; i++) {
      this.role_arr.push(this.roles_selectedItems[i].role_id);
    }
    for (let i = 0; i < this.agents_selectedItems.length; i++) {
      this.agent_arr.push(this.agents_selectedItems[i].agent_id);
    }
    const update_user_details = {
      user_id: this.user_id,
      firstname: this.firstname,
      lastname: this.lastname,
      displayname: this.displayname,
      email: this.email,
      username: this.username,
      roles: this.role_arr,
      agents: this.agent_arr
    };
    this.updateUserService.update_user_details(update_user_details)
      .subscribe(
        response => {
          if (response !== undefined) {
            this.closeDialog();
          }
        },
    );
  }

}

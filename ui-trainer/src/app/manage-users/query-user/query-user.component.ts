import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { CreateUserComponent } from '../create-user/create-user.component';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { DeleteUserComponent } from '../delete-user/delete-user.component';

import { QueryUserService } from '../../common/services/query-user.service';
import { CreateUserService } from '../../common/services/create-user.service';

declare var foo: Function;

@Component({
  selector: 'app-query-user',
  templateUrl: './query-user.component.html',
  styleUrls: ['./query-user.component.scss']
})
export class QueryUserComponent implements OnInit {
  displayedColumns: string[] = ['user_id', 'username', 'name', 'displayname', 'role', 'agent', 'email', 'edit'];
  dataSource: any;
  user_id: number;
  username: string;
  name: string;
  displayname: string;
  email: string;
  role: string;
  agent: string;
  allRoles: any;
  allAgents: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog,
              public queryUserService: QueryUserService,
              public createUserService: CreateUserService) { }

  ngOnInit() {
    this.getAllActiveUsers();
    this.getAllRoles();
    this.getAllAgents();
    this.dataSource.paginator = this.paginator;
  }

  getAllActiveUsers() {
    const active_user_details = {where_cond: true};
    this.queryUserService.get_all_active_users(active_user_details)
      .subscribe(
        response => {
          this.dataSource = new MatTableDataSource(JSON.parse(JSON.stringify(response)));
        },
      );
  }

  getAllRoles() {
    const roles_details = {where_cond: true};
    this.queryUserService.get_all_roles(roles_details)
      .subscribe(
        response => {
          this.allRoles = response;
        },
      );
  }

  getAllAgents() {
    const agent_details = {where_cond: true};
    this.createUserService.get_all_agents(agent_details)
      .subscribe(
        agents_response => {
          this.allAgents = agents_response;
        },
      );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogCreateUser(): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '800px',
      height: '550px',
      data: {agents: this.allAgents}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllActiveUsers();
    });
  }

  // tslint:disable-next-line:max-line-length
  openDialogUpdateUser(user_id: number, username: string, name: string, displayname: string, role: string, agent: string, email: string): void {
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width: '800px',
      height: '550px',
      data: {
        user_id: user_id,
        username: username,
        name: name,
        displayname: displayname,
        email: email,
        role: role,
        agent: agent
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllActiveUsers();
    });
  }

  openDialogDeleteUser(username: string): void {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      width: '800px',
      height: '280px',
      data: {username: username}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllActiveUsers();
    });
  }

  setUserDetails(user_id: number, username: string, name: string, displayname: string, role: string, agent: string, email: string): void {
    this.user_id = user_id;
    this.username = username;
    this.name = name;
    this.displayname = displayname;
    this.role = role;
    this.agent = agent;
    this.email = email;
  }

}

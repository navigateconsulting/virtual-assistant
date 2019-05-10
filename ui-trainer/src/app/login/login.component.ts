import { Component, OnInit } from '@angular/core';
import { CheckUserService } from '../common/services/check-user.service';

import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  checkCredentials: number;

  constructor(private router: Router,
    private checkUserService: CheckUserService) { }

  ngOnInit() {
  }

  login(): void {
    const login_details = {email: this.email, password: this.password};
    this.checkUserService.checkUserCredentials(login_details)
      .subscribe(
        response => {
          if (response === 1) {
            this.checkCredentials = 1;
            this.router.navigate(['admin']);
          } else {
            this.checkCredentials = 0;
          }
        },
      );
  }

}

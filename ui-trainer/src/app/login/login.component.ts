import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  checkCredentials: number;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login(): void {
    const login_details = {email: this.email, password: this.password};
  }

}

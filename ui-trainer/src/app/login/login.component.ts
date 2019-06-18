import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  checkCredentials: number;

  constructor(private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      if (this.loginForm.value['username'].trim() === this.loginForm.value['password'].trim()) {
        this.checkCredentials = 1;
        this.router.navigate(['applications']);
      } else {
        this.checkCredentials = 0;
      }
    }
  }

}

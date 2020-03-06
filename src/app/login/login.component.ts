import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';

import { AuthenticationService } from '../services/authentication.service';
import { LoginUser } from '../shared/loginUser';
import { User } from '../shared/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLogin: Boolean = true;
  isForgotPass: Boolean = false;
  loginText: String;
  loginError: String;
  signupError: String;

  loginUser = { email: '', password: '',  remember:false};
  signupUser = { email:'',password:'',passwordAgain:'', firstName:'', lastName:'',phoneNumber:null};
  resetPassUser = { email: ''};

  constructor(public dialogRef: MatDialogRef<LoginComponent>,
              private authService: AuthenticationService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  isLoginChange(){
    this.isLogin = this.isLogin ? false : true;
    this.loginError = '';
    this.signupError = '';
  }

  forgotPassChange() {
    this.isForgotPass = true;
  }

  leaveForgotPass(state: String) {
    if (state === 'login') {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
    this.isForgotPass = false;
  }

  onSubmitLogin() {
    this.loginError = '';
    this.authService.loginUser({username: this.loginUser.email, password: this.loginUser.password})
      .subscribe((res) => {
        if(res.success) {
          if(this.loginUser.remember) {
            window.localStorage.setItem('token', res.token);
          }
          window.localStorage.setItem('token', res.token);
          this.dialogRef.close();
          this.snackBar.open(res.status, 'Close', {
            duration: 5000
          });
        }
      },(err) => {
        console.log(err);
        if (err.status == 401) {
          this.loginError = 'The email or password provided is incorrect.'
        } else {
          this.loginError = err.error;
        }
        event.preventDefault();
      })
  }

  onSubmitSignup() {
    this.signupError = '';
    let user = {
      username: this.signupUser.email,
      firstName: this.signupUser.firstName,
      lastName: this.signupUser.lastName,
      password: this.signupUser.password,
      phone: this.signupUser.phoneNumber
    }
    this.authService.signupUser(user)
      .subscribe((res) => {
        if(res.statusCode == 200) {
          window.localStorage.setItem('token', res.token);
          this.dialogRef.close();
          this.snackBar.open(res.status, 'Close', {
            duration: 5000
          });
        }
      }, (err) => {
        console.log(err);
        if (err.status == 409) {
          this.signupError = 'The email provided is already in use.'
        } else {
          this.signupError = err.error;
        }
        event.preventDefault();
      })
  }

  onSubmitResetPass() {

  }

}

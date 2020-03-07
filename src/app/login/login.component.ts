import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
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

  loginUser = { username: '', password: '',  remember:false};
  signupUser = { username:'',password:'',passwordAgain:'', firstName:'', lastName:'',phone:null};
  resetPassUser = { email: ''};

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) data) { 
    if (data != null) {
      this.loginError = data.errMess;
    }
  }

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
    this.authService.loginUser({username: this.loginUser.username, password: this.loginUser.password})
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
        if (err.status == 401) {
          this.loginError = 'The email or password provided is incorrect.'
        } else {
          this.loginError = err.error.err.message;
        }
        event.preventDefault();
      })
  }

  onSubmitSignup() {
    this.signupError = '';
    this.authService.signupUser({
      firstName: this.signupUser.firstName,
      lastName: this.signupUser.lastName,
      username: this.signupUser.username,
      password: this.signupUser.password,
      phone: this.signupUser.phone,
    })
      .subscribe((res) => {
        window.localStorage.setItem('token', res.token);
        this.dialogRef.close();
        this.snackBar.open(res.status, 'Close', {
          duration: 5000
        });
      }, (err) => {
        if (err.status == 409) {
          this.signupError = 'The email provided is already in use.'
        } else {
          this.signupError = err.error.err.message;
        }
        event.preventDefault();
      })
  }

  onSubmitResetPass() {

  }

}

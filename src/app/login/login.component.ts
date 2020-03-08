import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, ɵangular_packages_forms_forms_a } from '@angular/forms';

import { AuthenticationService } from '../services/authentication.service';

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

  signupForm: FormGroup;

  loginUser = { username: '', password: '',  remember:false};
  resetPassUser = { email: ''};

  formErrors = {
    'firstName': '',
    'lastName': '',
    'username': '',
    'phone': '',
    'password': '',
    'passwordAgain': ''
  };

  validationMessages = {
    'firstName': {
      'required':'First Name is required.'
    },
    'lastName': {
      'required':'Last Name is required.'
    },
    'username': {
      'required':'Email is required.',
      'email': 'Email must be in correct format'
    },
    'phone' : {
      'required':'Phone number is required.',
      'pattern': 'Phone number must be 11 digits'
    },
    'password' : {
      'required':'Password is required.'
    },
    'passwordAgain' : {
      'required': 'Conformation password is required.',
      'notSame': 'The provided passwords must match'
    }
  };

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data) { 
    if (data != null) {
      this.loginError = data.errMess;
    }
  }

  ngOnInit() {
    this.createSignupForm();
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('password').value;
    let confirmPass = group.get('passwordAgain').value;

    return pass === confirmPass ? null : { notSame: true }     
  } 

  createSignupForm() {
    this.signupForm = this.fb.group({
      firstName:  ['',[Validators.required]],
      lastName: ['',[Validators.required]],
      username: ['',[Validators.required, Validators.email]],
      phone: ['', [Validators.required,Validators.pattern('[0-9]{11}')]],
      password: ['', [Validators.required]],
      passwordAgain: ['',[Validators.required]]
    }, {validator: this.checkPasswords });

    this.signupForm.valueChanges
      .subscribe(data => this.onValueChangedSignup(data));
    this.onValueChangedSignup();

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

  onValueChangedSignup(data?: any) {
    if (!this.signupForm) { return; }
    const form = this.signupForm;

      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
  
          this.formErrors[field] = '';
          const control = form.get(field);

          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
                if (control.errors.hasOwnProperty(key)) {
                  this.formErrors[field] = messages[key];
                  break;
                }
            }
          }
        }
      }

      /*
      this.formErrors['passwordAgain'] = '';
      if (form.get('password').dirty) {
        if (form.get('password').value !== form.get('passwordAgain').value) {
          this.formErrors['passwordAgain'] = this.validationMessages['passwordAgain']['notSame'];
        }
      }
      */
      console.log(this.formErrors)
      
  }

  onSubmitSignup() {
    let user = this.signupForm.value;
    this.signupError = '';
    this.authService.signupUser({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password: user.password,
      phone: user.phone,
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

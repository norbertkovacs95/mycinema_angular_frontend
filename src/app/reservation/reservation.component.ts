import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTabGroup } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';

import { TicketTypes } from '../shared/ticketTypes';
import { User } from '../shared/user';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {

  showTimeId: number;
  ticketFormValid: boolean= false;
  ticketsChoosen: boolean = false;
  seatsChoosen: boolean = true;
  totalPrice: number = 0;

  @ViewChild('tabs',{static: false}) tabGroup: MatTabGroup;
  ticketForm: FormGroup;
  userForm: FormGroup;
  selectedTickets: TicketTypes;
  user: User;
  numberOfTickets: number;
  formErrors = {
    'firstName': '',
    'lastName': '',
    'email': '',
  };

  validationMessages = {
    'firstName': {
      'required':'First Name is required.'
    },
    'lastName': {
      'required':'Last Name is required.'
    },
    'email': {
      'required':'Email is required.',
      'email': 'Email must be in correct format'
    }
  };

  constructor(  private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ReservationComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.showTimeId = data.showtimeId;
      this.createForms();
  }

  ngOnInit() {
    console.log(this.showTimeId);
  }

  createForms() {
    this.ticketForm = this.fb.group({
      student:  0,
      elderly: 0,
      normal: 0,
    });

    this.userForm = this.fb.group({
      firstName:  ['',[Validators.required]],
      lastName: ['',[Validators.required]],
      email: ['',[Validators.required, Validators.email]]
    });

    this.ticketForm.valueChanges
      .subscribe(data => this.onValueChangedTicket(data));
    this.onValueChangedTicket();

    this.userForm.valueChanges
      .subscribe(data => this.onValueChangedUser(data));

  }

  onValueChangedTicket(data?: any) {
    if (!this.ticketForm) { return; }
    const form = this.ticketForm;
    
    this.selectedTickets = form.value;
    this.numberOfTickets = this.selectedTickets.student + this.selectedTickets.elderly + this.selectedTickets.normal;
    this.totalPrice = this.selectedTickets.student * 1250 + this.selectedTickets.elderly * 1250 + this.selectedTickets.normal * 1450;
    
    if (this.numberOfTickets>0) {
      this.ticketFormValid = true;
    } else {
      this.ticketFormValid = false;
      this.ticketsChoosen = false;
    }
  }

  onValueChangedUser(data?:any){
    if (!this.userForm) { return; }
    const form = this.userForm;

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
  }


  onSubmitTicket(){
    this.ticketsChoosen = true;
    this.tabGroup.selectedIndex=1;
  }

  onSubmitUser(){
    this.snackBar.open('Reservation is successfull. Email sent to your address!', 'Close', {
      duration: 5000
    });
    this.dialogRef.close();
  }
}


import { Component, OnInit, ViewChild,Inject, ViewEncapsulation } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormBuilder, FormGroup, Validators, CheckboxControlValueAccessor } from '@angular/forms';

import { MatTabGroup } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';

import { TicketTypes } from '../shared/ticketTypes';
import { User } from '../shared/user';
import { Seat } from '../shared/seat';
import { ShowTime } from '../shared/showTime';
import { CinemaHall } from '../shared/cinemaHall';
import { Section } from '../shared/section';

import { SeatService } from '../services/seat.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReservationComponent implements OnInit {

  cinemaHallId: string;

  ticketFormValid: boolean= false;
  ticketsChoosen: boolean = false;
  seatsChoosen: boolean = false;
  seatsValid: boolean = false;
  totalPrice: number = 0;

  @ViewChild('tabs',{static: false}) tabGroup: MatTabGroup;
  ticketForm: FormGroup;
  userForm: FormGroup;
  selectedTickets: TicketTypes;
  user: User;
  seats: Seat[];
  showTime: ShowTime;
  cinemaHall: CinemaHall;
  sections: Section[];
  seatCheckboxes;
  choosenSeats: Seat[] = [];
  rows = [];
  cols = [];
  curCol: number;
  curRow: number;
  numberOfTickets: number;
  numberOfSeats: number = 0;

  formErrors = {
    'firstName': '',
    'lastName': '',
    'email': '',
    'phone': ''
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
    },
    'phone' : {
      'required':'Phone number is required.',
      'phone': 'Phone number must be in correct format'
    }
  };

  constructor(
    private seatService: SeatService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ReservationComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

      this.createForms();

      this.showTime = data.showtime;
      this.cinemaHallId = data.showtime.cinemaHall
      this.seats = data.seats;
      this.cinemaHall= data.cinemaHall;
      this.sections = data.sections;

      for (const section of this.sections) {
        let row = section.rowCount;
        let col = section.columnCount;
        this.rows.push(Array(row).fill(0));
        this.cols.push(Array(col).fill(0));
      }

      this.seatCheckboxes = [];
      for (let i = 0; i < this.cinemaHall.rowCount; i++) {
        let colArr = [];
        for (let ii = 0; ii < this.cinemaHall.columnCount; ii++) {
          colArr.push(false);
        }
        this.seatCheckboxes.push(colArr);
      }
  }

  ngOnInit() {
  }

  isSeatFree(col: number, row: number){
    if(!this.seats){return;}
 
    let seat: Seat = this.getSeat(col,row)

    if(!seat){
      console.log('row',row);
      console.log("col",col);
    }
    if (seat.status == "FREE") {
      return true;
    } else {
      return false;
    }
  }

  getSeat (col:number, row:number):Seat {
    return this.seats.filter((seat) => seat.column == col).filter(seat => seat.row == row)[0];
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
      email: ['',[Validators.required, Validators.email]],
      phone: ['', [Validators.required]]
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

  setRowCor(col:number,row:number) {
    this.curCol = col;
    this.curRow = row;
  }  

  onCheckboxChange(values:any){
    let col = this.curCol;
    let row = this.curRow;

    if (values.checked) {
      this.numberOfSeats += 1
      this.choosenSeats.push(this.getSeat(col,row));
      this.seatCheckboxes[row-1][col-1] = true;

      if (this.numberOfSeats > this.numberOfTickets) { 
        let colNum = this.choosenSeats[0].column -1;
        let rowNum = this.choosenSeats[0].row - 1;

        this.seatCheckboxes[rowNum][colNum] = false;
        this.choosenSeats.shift();
        this.numberOfSeats -= 1
      }
    } 
    else {
      this.numberOfSeats -= 1
      this.seatCheckboxes[row-1][col-1] = false;
      this.choosenSeats = this.choosenSeats.filter((seat) => {
        if(seat.row == row && seat.column == col) {
          return false;
        } else { 
          return true;
        }
      });
    }

    if (this.numberOfSeats === this.numberOfTickets) {
      this.seatsValid = true;
    } 
    else {
      this.seatsValid = false;
    }
  }

  onSubmitTicket(){
    this.ticketsChoosen = true;
    this.tabGroup.selectedIndex=1;
  }

  onSubmitSeats() {
    this.seatsChoosen = true;
    this.tabGroup.selectedIndex=2;
  }

  onSubmitUser(){
    for (const seat of this.choosenSeats) {
      seat.status = "TAKEN"
    }
    this.seatService.putSeats(this.choosenSeats).subscribe((seats) => {
      console.log(seats,'put'); 
      this.dialogRef.close(); 
      this.snackBar.open('Reservation is successfull. Email sent to your address!', 'Close', {
        duration: 5000
      });
    })
  }
}


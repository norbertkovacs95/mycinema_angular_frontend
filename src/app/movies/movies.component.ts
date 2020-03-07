import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { ReservationComponent } from '../reservation/reservation.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {  MoviesService } from '../services/movies.service';
import {  ShowtimesService } from '../services/showtimes.service';
import {  CinemahallService } from '../services/cinemahall.service';
import {  SeatService } from '../services/seat.service';
import {  SectionService } from '../services/section.service';
import { AuthenticationService } from '../services/authentication.service';

import { CinemaHall } from '../shared/cinemaHall';
import { Seat } from '../shared/seat';
import { Section } from '../shared/section';
import { Movie } from "src/app/shared/movie";
import { ShowTime } from "src/app/shared/showTime";

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  movies: Movie[];
  filteredMovies: Movie[];
  showTimes: ShowTime[];
  minDate: Date;
  maxDate: Date;
  selectedMovie: String;

  filterForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private moviesService: MoviesService,
    private showTimesService: ShowtimesService,
    private cinemaHallService : CinemahallService,
    private seatService: SeatService,
    private sectionService: SectionService,
    private authService: AuthenticationService,
    private fb: FormBuilder
    ) { 

    }

  ngOnInit() {

    const currentYear = new Date().getFullYear();
    const currMonth = new Date().getMonth();
    const currDay = new Date().getDay();
    this.minDate = new Date(currentYear, currMonth, currDay+1);
    this.maxDate = new Date(currentYear, currMonth, currDay+1);

    this.filterForm = this.fb.group({
      movie:  0,
      date: new Date()
    });
      
    this.filterForm.valueChanges
      .subscribe(data => this.onValueChangeFilterForm(data));
    this.onValueChangeFilterForm();

    this.showTimesService.getShowTimes()
      .subscribe((showTimes) => {
          this.showTimes = showTimes;
      });

    this.moviesService.getMovies()
      .subscribe((movies) => {
        this.movies = movies;
        this.filteredMovies = movies;
    });
      
  }

  onValueChangeFilterForm(data?: any) {
    if (!this.filterForm || !this.movies || !this.filteredMovies) { return; }
    
    const form = this.filterForm;
    let movies:Movie[];

    if (form.controls.movie.value) {
      movies = this.movies.filter((movie) => movie.title == form.controls.movie.value);
    } else {
      movies = this.movies;
    }

    // Need to change filtering to filter by  date as well
    if (!form.controls.date.value) {
      // filter local movies array by date
    }

    this.filteredMovies = movies;
  }

  returnShowTime(id: string): string {
    return this.showTimes.filter((showTime) => showTime._id == id)[0].startDate;
  }

  openReservationForm(id: string) {

    let showTime:ShowTime = this.showTimes.filter((showtime) => showtime._id == id)[0];
    let cinemaHall: CinemaHall;
    let seats: Seat[];
    let sections: Section[]


    this.authService.verifyUser()
      .subscribe(res => {
        this.cinemaHallService.getCinemaHall(showTime["cinemeHall"])
          .subscribe((_cinemaHall) => {
            cinemaHall = _cinemaHall;
            this.seatService.getSeats()
              .subscribe((_seats) => {
                _seats = _seats.filter(seat => seat.showTime == showTime._id);
                seats = _seats;
                this.sectionService.getSeactionForCinemaHall(cinemaHall._id)
                  .subscribe((_sections) => {
                    sections = _sections;
                    this.dialog.open(ReservationComponent, {width: '750px', height: '500px',data:{
                      showtime: showTime,
                      cinemaHall: cinemaHall,
                      seats: seats,
                      sections: sections,
                      user: res.user
                    }});
                  })
            })
          })
        },
        err => {
          if (err.status === 401) {
            this.dialog.open(LoginComponent, {width: '500px', height: '500px',data:{
              errMess: "Please make sure to login or register before you book tickets"
            }});
          } else {
            console.log(err);
          }
      })
  }

}

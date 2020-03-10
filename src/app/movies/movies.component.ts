import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { ReservationComponent } from '../reservation/reservation.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { flatMap } from 'rxjs/operators'
import { pipe } from 'rxjs';

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

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate()+1);
    this.minDate = today;
    this.maxDate = tomorrow;

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


    this.cinemaHallService.getCinemaHall(showTime["cinemeHall"])
      .pipe(flatMap((_cinemaHall) => {
        cinemaHall = _cinemaHall;
        return this.seatService.getSeats()}))
      .pipe(flatMap((_seats) => {
        _seats = _seats.filter(seat => seat.showTime == showTime._id);
        seats = _seats;
        return this.sectionService.getSeactionForCinemaHall(cinemaHall._id)}))
      .pipe(flatMap((_sections) => {
        sections = _sections;
        return this.authService.verifyUser()}))
      .subscribe((res) => {
        this.dialog.open(ReservationComponent, {width: '750px', height: '500px',data:{
          showtime: showTime,
          cinemaHall: cinemaHall,
          seats: seats,
          sections: sections,
          user: res.user
        }})
      }, (err) => {
        if (err.status === 401) {
          this.dialog.open(LoginComponent, {width: '500px', height: '500px',data:{
            errMess: "Please make sure to login or register before you book tickets",
            showtime: showTime,
            cinemaHall: cinemaHall,
            seats: seats,
            sections: sections
          }});
        } else {
          console.log(err);
        }
    })
  }

}

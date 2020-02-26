import { Component, OnInit } from '@angular/core';
import { Movie } from "src/app/shared/movie";
import { ShowTime } from "src/app/shared/showTime";

import { MatDialog, MatDialogRef } from '@angular/material';
import { ReservationComponent } from '../reservation/reservation.component';

import {  MoviesService } from '../services/movies.service';
import {  ShowtimesService } from '../services/showtimes.service';
import {  CinemahallService } from '../services/cinemahall.service';
import {  SeatService } from '../services/seat.service';
import {  SectionService } from '../services/section.service';
import { CinemaHall } from '../shared/cinemaHall';
import { Seat } from '../shared/seat';
import { Section } from '../shared/section';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  movies: Movie[];
  showTimes: ShowTime[];

  constructor(
    public dialog: MatDialog,
    private moviesService: MoviesService,
    private showTimesService: ShowtimesService,
    private cinemaHallService : CinemahallService,
    private seatService: SeatService,
    private sectionService: SectionService
    ) { }

  ngOnInit() {

    this.showTimesService.getShowTimes()
      .subscribe((showTimes) => {
          this.showTimes = showTimes;
      });

    this.moviesService.getMovies()
      .subscribe((movies) => {
        this.movies = movies;
    });
      
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
                  sections: sections
                }});
              })
        })
      })
  }

}

import { Component, OnInit } from '@angular/core';
import { Movie } from "src/app/shared/movie";
import { MOVIES } from "src/app/shared/movies";

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  movies: Movie[] = MOVIES;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, ElementRef } from '@angular/core';
import { Movie } from '../shared/movie';
import { MoviesService } from '../services/movies.service';
import { flatMap } from 'rxjs/operators';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  featuredMovie: Movie;
  nowPlaying: Movie[];
  comingSoon: Movie[];
  movies: Movie[];
  movieIds: String[];
  isNowPlaying: Boolean = true;

  constructor(private movieService: MoviesService, private el: ElementRef) {
    this.movieService.getFeaturedMovies()
    .pipe(flatMap((_movies) => {
      this.featuredMovie = _movies[0];
      this.movies = _movies;
      this.movieIds = _movies.map(movie => movie._id);
      this.nowPlaying = _movies.slice(0,3);
      return this.movieService.getComingSoonMovies();
    }))
    .subscribe(_movies => this.comingSoon = _movies.slice(0,3));
  }

  ngOnInit() {
  }

  changeFeaturedMovie(id:String, direction:string) {
    const index = this.movieIds.indexOf(id);
    if (direction === "prev") {
      let prev = this.movieIds[(this.movieIds.length + index - 1) % this.movieIds.length];
      this.featuredMovie = this.movies.filter(movie => movie._id == prev)[0];
      this.addSelectedMovieClass(this.movieIds.indexOf(prev));
    } else {
      let next = this.movieIds[(this.movieIds.length + index + 1) % this.movieIds.length];
      this.featuredMovie = this.movies.filter(movie => movie._id == next)[0];
      this.addSelectedMovieClass(this.movieIds.indexOf(next));
    }
  }

  selectFeaturedMovie(index: any) {
    this.addSelectedMovieClass(index);
    this.featuredMovie = this.movies[index];
  }

  addSelectedMovieClass(index: any) {
    for(let i = 0; i < this.movies.length; i++) {
      let myTag = this.el.nativeElement.querySelector('#min' + i);
      if(myTag.classList.contains('padding-bottom')) {
          myTag.classList.remove('padding-bottom');
      }
    }
    let myTag = this.el.nativeElement.querySelector('#min' + index)
    myTag.classList.add('padding-bottom');
  }

  changeNowPlaying() {
    if(this.isNowPlaying) {
      let myTag = this.el.nativeElement.querySelector('#now-playing-header');
      if(myTag.classList.contains('title-selected')) {
        myTag.classList.remove('title-selected');
        this.el.nativeElement.querySelector('#coming-soon-header').classList.add('title-selected');
      }
    } else {
      let myTag = this.el.nativeElement.querySelector('#coming-soon-header');
      if(myTag.classList.contains('title-selected')) {
        myTag.classList.remove('title-selected');
        this.el.nativeElement.querySelector('#now-playing-header').classList.add('title-selected');
      }
    }
    this.isNowPlaying = this.isNowPlaying ? false : true;
    }

}

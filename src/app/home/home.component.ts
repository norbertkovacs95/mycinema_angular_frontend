import { Component, OnInit, ElementRef } from '@angular/core';
import { Movie } from '../shared/movie';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  featuredMovie: Movie;
  nowPlaying: Movie[];
  comingSonn: Movie[];
  movies: Movie[];
  movieIds: String[];

  constructor(private movieService: MoviesService, private el: ElementRef) {
    this.movieService.getFeaturedMovies()
    .subscribe((movies) => {
      this.featuredMovie = movies[0];
      this.movies = movies;
      this.nowPlaying = movies.slice(0,4);
      this.movieIds = movies.map(movie => movie._id);
    });
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

}

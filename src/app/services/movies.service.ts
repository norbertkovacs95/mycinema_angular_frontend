import { Injectable } from '@angular/core';
import { Movie } from 'src/app/shared/movie';
import { Observable, of} from 'rxjs';
import { delay, catchError } from 'rxjs/operators';

import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';


@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) { }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(baseURL + 'movies');
  }

  getFeaturedMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(baseURL + 'movies')
      .pipe(map(movies => movies.filter(movie => movie.featured)));
  }

  getMovie(id: string): Observable<Movie> {
    return this.http.get<Movie>(baseURL + 'movies/' + id);
  }

}

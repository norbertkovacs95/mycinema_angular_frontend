import { Injectable } from '@angular/core';
import { Seat } from 'src/app/shared/seat';
import { Observable, of, from} from 'rxjs';
import { map, concatMap } from 'rxjs/operators'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  constructor(private http: HttpClient) { }

  getSeats(): Observable<Seat[]> {
    return this.http.get<Seat[]>(baseURL + 'seats');
  }

  getSeatsForShowTime(cinemaHall:string, showTime:string): Observable<Seat[]> {
    return this.http.get<Seat[]>(baseURL)
      .pipe(map(seats => seats.filter(seat => seat.cinemaHall === cinemaHall && seat.showTime === showTime)));
  }

  putSeats(seats: Seat[]): Observable<Seat> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return from(seats).pipe(concatMap(seat => this.http.put<Seat>(baseURL + 'seats/' + seat._id, seat, httpOptions)))
  }

}

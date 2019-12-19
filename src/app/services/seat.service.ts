import { Injectable } from '@angular/core';
import { Seat } from 'src/app/shared/seat';
import { Observable, of} from 'rxjs';
import { delay, catchError } from 'rxjs/operators';

import { map } from 'rxjs/operators';
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


  getSeatsByCinemaHall(id: string): Observable<Seat[]> {
    return this.http.get<Seat[]>(baseURL + 'seats?cinemaHall=' + id);
  }

  putSeat(seat: Seat): Observable<Seat> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<Seat>(baseURL + 'seats/' + seat.id, seat, httpOptions);
  }

}

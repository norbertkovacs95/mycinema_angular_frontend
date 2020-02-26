import { Injectable } from '@angular/core';
import { Section } from 'src/app/shared/section';
import { Observable, of, from} from 'rxjs';
import { map, concatMap } from 'rxjs/operators'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class SectionService {


  constructor(private http: HttpClient) { }

  getSeactionForCinemaHall(cinemaHall: string): Observable<Section[]> {
    return this.http.get<Section[]>(baseURL + 'sections')
    .pipe(map(seats => seats.filter(seat => seat.cinemaHall === cinemaHall)));
  }


}

import { Injectable } from '@angular/core';
import { CinemaHall } from 'src/app/shared/cinemaHall';
import { Observable, of} from 'rxjs';
import { delay, catchError } from 'rxjs/operators';

import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class CinemahallService {

  
  constructor(private http: HttpClient) { }

  getCinemaHalls(): Observable<CinemaHall[]> {
    return this.http.get<CinemaHall[]>(baseURL + 'cinemahalls');
  }


  getCinemaHall(id: string): Observable<CinemaHall> {
    return this.http.get<CinemaHall>(baseURL + 'cinemahalls/' + id);
  }
}

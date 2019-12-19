import { Injectable } from '@angular/core';
import { ShowTime } from 'src/app/shared/showTime';
import { Observable, of} from 'rxjs';
import { delay, catchError } from 'rxjs/operators';

import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class ShowtimesService {

  
  constructor(private http: HttpClient) { }

  getShowTimes(): Observable<ShowTime[]> {
    return this.http.get<ShowTime[]>(baseURL + 'showtimes');
  }


  getShowTime(id: string): Observable<ShowTime> {
    return this.http.get<ShowTime>(baseURL + 'showtimes/' + id);
  }
}

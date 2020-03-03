import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/user';
import { LoginUser } from 'src/app/shared/loginUser';
import { Observable, of} from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  signupUser(user: User): Observable<any> {
    return this.http.post<any>(baseURL + 'users/signUp',user);
  }

  loginUser(user: LoginUser): Observable<any>  {
    return this.http.post<any>(baseURL + 'users/login',user);
  }
}

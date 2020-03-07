import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/user';
import { LoginUser } from 'src/app/shared/loginUser';
import { TokenService } from './token.service';

import { Observable, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenService) { }

  signupUser(user: User): Observable<any> {
    return this.http.post<any>(baseURL + 'users/signup',user);
  }

  loginUser(user: LoginUser): Observable<any>  {
    return this.http.post<any>(baseURL + 'users/login',user);
  }

  verifyUser(): Observable<any> {
    let token = this.tokenService.getJWT();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post<any>(baseURL + 'users/verifyUser', {}, httpOptions)
  }
}

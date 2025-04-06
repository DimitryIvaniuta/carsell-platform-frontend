import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenKey } from './application.keys';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    console.log('-username: '+username)
    console.log('-password: '+password)
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { username: username, password:password }, { observe: 'response' })
      .pipe(
        tap(response => {
          const token = response.headers.get('Authorization') || response.body?.token;
          if (token) {
            localStorage.setItem(TokenKey, token);
            localStorage.setItem('currentUser', username);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TokenKey);
    localStorage.removeItem('currentUser');
  }

  getToken(): string | null {
    return localStorage.getItem(TokenKey);
  }

  signup(user: any): Observable<any> {
    return this.http.post('/api/users/signup', user);
  }
}

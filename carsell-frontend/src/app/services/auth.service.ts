import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    console.log('-username: '+username)
    console.log('-password: '+password)
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { username: username, password:password }, { observe: 'response' })
      .pipe(
        tap(response => {
          const token = response.headers.get('Authorization') || response.body?.token;
          if (token) {
            localStorage.setItem(this.tokenKey, token);
            localStorage.setItem('currentUser', username);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('currentUser');
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  signup(user: any): Observable<any> {
    return this.http.post('/api/users', user);
  }
}

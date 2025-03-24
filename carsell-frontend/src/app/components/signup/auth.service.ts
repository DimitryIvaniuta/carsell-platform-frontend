// src/app/shared/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'jwt_token';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    this.currentUserSubject = new BehaviorSubject<any>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('/login', { username, password }, { observe: 'response' })
      .pipe(tap(response => {
        const token = response.headers.get('Authorization') || response.body.token;
        if (token) {
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem('currentUser', JSON.stringify({ username }));
          this.currentUserSubject.next({ username });
        }
      }));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  signup(user: any): Observable<any> {
    return this.http.post('/api/users', user);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }
}

// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
// import * as jwt_decode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { TokenKey } from './application.keys';

//
// Interfaces for request/response payloads
//

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponseBody {
  token: string;
  // add other fields if your backend returns them (e.g. userId)
}

interface SignupRequest {
  username: string;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles?: string[];
}

interface SignupResponse {
  id: number;
  username: string;
  email: string;
  // etc.
}

//
// AuthService Implementation
//

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = TokenKey;

  constructor(private http: HttpClient) {}

  /** Perform login, store token+username */
  login(username: string, password: string): Observable<void> {
    const payload: LoginRequest = { username, password };
    return this.http
      .post<LoginResponseBody>(
        `${environment.apiUrl}/auth/login`,
        payload,
        { observe: 'response' }
      )
      .pipe(
        tap((resp: HttpResponse<LoginResponseBody>) => {
          // Try header first, then body.token
          const headerToken = resp.headers.get('Authorization');
          const bodyToken = resp.body?.token;
          const token = headerToken ?? bodyToken;
          if (!token) {
            throw new Error('No JWT returned from login');
          }
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem('currentUser', username);
        }),
        // we only care about side‑effects, so emit void
        map(() => {})
      );
  }

  /** Clear session */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('currentUser');
  }

  /** Get raw JWT */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** True if a valid (non‑expired) token is present */
  isLoggedIn(): boolean {
    const token = this.getToken();
    console.log('Login exp: '+token)
    return token !== null && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    console.log('Token exp: '+token)
    if (!token) return true;
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      // exp is seconds since epoch
      return Date.now() / 1000 > exp;
    } catch {
      return true;
    }
  }

  /** Signup new user */
  signup(user: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(
      `${environment.apiUrl}/users/signup`,
      user
    );
  }
}

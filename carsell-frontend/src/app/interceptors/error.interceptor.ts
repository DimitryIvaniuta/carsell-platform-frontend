import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log('error status: '+err.status)
        if (err.status === 401 || err.status === 403) {
          // Token expired or invalid—clear and go to login

          this.auth.logout();
          this.router.navigate(['/login'], {
            queryParams: { sessionExpired: true }
          });
        }
        return throwError(() => err);
      })
    );
  }
}

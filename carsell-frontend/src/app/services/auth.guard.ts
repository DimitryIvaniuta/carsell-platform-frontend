import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // Check for an active session (e.g., a stored JWT token)
    console.log('token auth: '+this.authService.getToken())
    // if (this.authService.getToken()) {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // Redirect to login page if no active session is found
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }
  }
}

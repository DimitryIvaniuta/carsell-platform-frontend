import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    MatToolbar,
    RouterOutlet
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

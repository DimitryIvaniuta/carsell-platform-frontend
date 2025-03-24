// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Create the reactive form with username and password fields
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Use the AuthService to log in. It should handle storing the JWT token.
      this.authService.login(
        this.loginForm.value.username,
        this.loginForm.value.password
      ).subscribe({
        next: () => this.router.navigate(['/cars']),
        error: err => {
          console.error(err);
          this.errorMessage = 'Invalid credentials, please try again.';
        }
      });
    }
  }
}

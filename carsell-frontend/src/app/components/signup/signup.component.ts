// src/app/components/signup/signup.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      login: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      roles: [['SELLER']]  // default role
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value)
        .subscribe({
          next: () => this.router.navigate(['/login']),
          error: err => {
            console.error(err);
            this.errorMessage = 'Signup failed. Please try again.';
          }
        });
    }
  }
}

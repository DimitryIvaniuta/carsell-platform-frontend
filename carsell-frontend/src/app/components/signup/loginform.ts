import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login-page',
  template: `
    <div>
      <!-- Username input -->
      <input
        id="username-input"
        type="text"
        [value]="username"
        (input)="onUsernameChange($event)"
      />

      <!-- Password input -->
      <input
        id="password-input"
        type="password"
        [value]="password"
        (input)="onPasswordChange($event)"
      />

      <!-- Submit button, disabled until both fields have content -->
      <button
        id="login-button"
        [disabled]="username === '' || password === ''"
        (click)="onSubmit()"
      >
        Submit
      </button>
    </div>
  `
})
export class LoginPageComponent {
  @Output() login = new EventEmitter<{ username: string; password: string }>();

  username: string = '';
  password: string = '';

  onUsernameChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.username = input.value;
  }

  onPasswordChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.password = input.value;
  }

  onSubmit(): void {
    this.login.emit({ username: this.username, password: this.password });
  }
}

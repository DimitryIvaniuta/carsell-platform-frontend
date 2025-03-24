
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CarListComponent } from './components/cars/car-list.component';
import { AuthGuard } from './shared/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/cars', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'cars', component: CarListComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/cars' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

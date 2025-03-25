import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string; // ISO date string
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`/api/users/${id}`);
  }
}

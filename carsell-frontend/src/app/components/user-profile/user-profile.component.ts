import { Component, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { UserService, UserResponse } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: UserResponse | null = null;


  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Retrieve the current user id from localStorage (set it during login)
    const currentUserIdStr = localStorage.getItem('currentUserId');
    if (currentUserIdStr) {
      const userId = +currentUserIdStr;
      this.userService.getUserById(userId).subscribe({
        next: (userResponse) => this.user = userResponse,
        error: (err) => console.error('Error fetching user:', err)
      });
    }
  }
}

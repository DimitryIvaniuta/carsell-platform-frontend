# CarSell Platform - Angular Frontend

This project is the frontend part of the CarSell Platform, a modern web application for buying and selling cars. It is built with Angular and communicates with a RESTful backend for user authentication via JWT and CRUD operations for car listings.

## Features

- **User Authentication**
    - Login page for user authentication.
    - Signup page for new user registration.
    - Secure authentication with JWT token management.
- **User Dashboard**
    - User Profile page to display user details.
    - Navigation menu that displays the logged-in user's profile.
- **Cars Management**
    - Cars Grid page that lists car listings.
    - CRUD operations for creating, updating, and deleting car listings.
    - Modal dialogs for adding or editing car details.
- **Responsive UI**
    - Uses Angular Material for a consistent and professional UI.
    - Responsive design principles for optimal viewing on all devices.

## Technologies Used

- Angular (v19.x)
- Angular Material
- RxJS
- Angular Router
- HTTP Interceptors for JWT token attachment
- Jasmine/Karma for unit testing
- Protractor/Cypress for end-to-end testing (if applicable)

## Setup Instructions

### Prerequisites

- Node.js (v20.x recommended)
- npm (v11.x recommended)
- Angular CLI (v19.x)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd carsell-platform-frontend


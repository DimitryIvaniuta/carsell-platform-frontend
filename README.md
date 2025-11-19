# CarSell Platform – Frontend (Angular 19)

Modern, production‑grade Angular 19 frontend for the **CarSell Platform** – a JWT‑secured car‑selling application.  
The app provides authentication, user profile management, and a fully‑featured Cars grid with polymorphic car types (SEDAN, SUV, TRUCK) and full CRUD operations.

---

## 1. Technology Stack

### Frontend

- **Angular**: 19.2.3 (standalone components, new `provideHttpClient` API)
- **Angular CLI**: 19.2.4
- **Angular Material**: 19.2.6
- **TypeScript**: 5.7.3
- **RxJS**: 7.8.2
- **Zone.js**: 0.15.x

### Backend (integrated with this frontend)

- **Spring Boot** – REST API, validation
- **Spring Security** – JWT authentication, optional CSRF via cookie
- **Jackson** – polymorphic `@type` model for cars (`BaseCarRequest`, `SedanCarRequest`, `SUVCarRequest`, `TruckCarRequest`)

---

## 2. Features

### 2.1 Authentication & User Management

- **Login** via `POST /api/auth/login`
  - Sends `{ "username": "...", "password": "..." }` JSON payload.
  - Expects JWT either in the `Authorization` header or as `{ "token": "..." }` in the response body.
  - JWT is stored in `localStorage` under a fixed token key (`TokenKey`).
- **Signup** via `POST /api/users/signup`
  - Uses a `SignupRequest` DTO with:
    - `username`, `login`, `email`, `firstName`, `lastName`, `password`, optional `roles` (default: `SELLER`).
- **AuthService**
  - Centralized authentication logic:
    - `login(username, password)` – performs HTTP POST and caches token + username.
    - `logout()` – clears `localStorage` and resets state.
    - `getToken()` – returns the current JWT.
    - `isLoggedIn()` – checks for presence and validity of token.
    - `isTokenExpired()` – uses `jwt-decode` to read the `exp` claim.
- **AuthGuard**
  - Protects `/cars` and `/profile` routes.
  - If no valid or non‑expired token is present, redirects to `/login`.

### 2.2 HTTP & Security

The application uses the **modern Angular HttpClient configuration**:

- `provideHttpClient()` with:
  - `withFetch()` – fetch‑based HTTP backend.
  - `withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' })` – optional CSRF support.
  - `withInterceptorsFromDi()` – loads all `HTTP_INTERCEPTORS` from Angular DI.

Configured **interceptors**:

- **JwtInterceptor**
  - Reads the JWT from `AuthService.getToken()`.
  - Attaches `Authorization: Bearer <token>` to all outgoing API calls under `/api/**`.
- **ErrorInterceptor**
  - Listens for `401` and `403` responses:
    - Calls `AuthService.logout()` when token/session is invalid.
    - Redirects user to `/login`.
  - Ensures that when the backend restarts or keys rotate, the client cleanly logs out instead of silently failing.

### 2.3 Car Management (CRUD + Polymorphism)

- **Cars list** – route: `/cars`
  - Angular Material table (`MatTable`) with:
    - Sorting (`MatSort`)
    - Pagination (`MatPaginator`)
    - Search filter (client-side)
    - Dynamic column visibility toggles
    - Actions column with Edit/Delete buttons
- **Polymorphic car types**
  - Backend exposes JSON shaped like:

    ```json
    {
      "base": {
        "id": 10120,
        "carType": "SEDAN",
        "make": "Toyota",
        "model": "Camry",
        "year": 2013,
        "price": 121233,
        "description": "test"
      },
      "trunkCapacity": 4
    }
    ```

  - Frontend uses strict TypeScript models:
    - `enum CarType { SEDAN, SUV, TRUCK }`
    - `BaseCarResponse` – shared fields (`id`, `make`, `model`, `year`, `price`, `description`).
    - `SedanCarResponse`, `SUVCarResponse`, `TruckCarResponse` – extend with extra props (`trunkCapacity`, `fourWheelDrive`, `payloadCapacity`).
  - `createCarResponse(raw: CarResponseRaw)` factory:
    - Reads `raw.base.carType`.
    - Builds a `BaseCarResponse` from `raw.base`.
    - Instantiates the specific typed response class (Sedan/SUV/Truck).
    - Returns a strictly‑typed `CarResponse` instance.

- **Add Car dialog**
  - `CarAddDialogComponent` (standalone).
  - Uses `ReactiveFormsModule` and Angular Material form controls.
  - Builds a form with:
    - Base fields: `make`, `model`, `year`, `price`, `description`, `@type`.
    - Dynamic fields based on selected car type:
      - SEDAN → `trunkCapacity`, `sedanCapacity`.
      - SUV → `fourWheelDrive`.
      - TRUCK → `payloadCapacity`.
  - Dynamic configs are stored in `models/cars/configuration` (e.g., `sedan.config.ts`, `suv.config.ts`, `truck.config.ts`) to avoid large `switch` blocks.

- **Edit Car dialog**
  - `CarEditDialogComponent` (standalone).
  - Receives a fully‑populated DTO built from a selected `CarResponse`.
  - Reuses the same configuration mechanism to build the extra field controls.
  - Submits `PUT /api/cars/{id}` with a polymorphic car request payload.

### 2.4 User Profile

- **UserProfileComponent**
  - Fetches the current user via `GET /api/users/{id}`.
  - Displays:
    - `username`, `email`, `name`, `firstName`, `lastName`, `phone`.
    - `createdAt`, `updatedAt`.
  - Built with Angular Material cards and standard Angular pipes for formatting.

---

## 3. Project Structure

Relevant frontend structure:

```text
carsell-frontend/
  src/
    app/
      app.component.ts
      app.component.html
      app-routing.module.ts

      components/
        login/
          login.component.ts
          login.component.html
        signup/
          signup.component.ts
          signup.component.html
        user-profile/
          user-profile.component.ts
          user-profile.component.html
        cars/
          car-list.component.ts
          car-list.component.html
          car-add-dialog.component.ts
          car-add-dialog.component.html
          car-edit-dialog.component.ts
          car-edit-dialog.component.html
          car-response.component.ts
          car-response.component.html

      models/
        cars/
          car-request.model.ts
          car-response.model.ts
          configuration/
            car-type.config.ts
            extra-car-fields.ts
            sedan.config.ts
            suv.config.ts
            truck.config.ts

      services/
        auth.service.ts
        car.service.ts
        jwt-interceptor.ts
        auth.guard.ts

      interceptors/
        error.interceptor.ts

    environments/
      environment.ts
      environment.prod.ts

  proxy.conf.json
  package.json
  tsconfig.json
  angular.json
  README.md
```

---

## 4. Configuration

### 4.1 Environment

Development environment configuration:

```ts
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

All services use `environment.apiUrl` as the base:

- Auth: `POST ${environment.apiUrl}/auth/login`
- Users: `POST ${environment.apiUrl}/users/signup`, `GET ${environment.apiUrl}/users/{id}`
- Cars: `GET/POST/PUT/DELETE ${environment.apiUrl}/cars`

### 4.2 Dev Proxy (optional)

`proxy.conf.json` (used to avoid CORS issues during dev):

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

In `package.json`:

```json
"scripts": {
  "start": "ng serve --proxy-config proxy.conf.json",
  "build": "ng build",
  "test": "ng test",
  "lint": "ng lint",
  "e2e": "ng e2e"
}
```

---

## 5. Running the Application

### 5.1 Prerequisites

- Node.js ≥ 20.x
- npm ≥ 10.x
- Backend (Spring Boot) running on `http://localhost:8080`

### 5.2 Install Dependencies

```bash
cd carsell-frontend
npm install
```

### 5.3 Start Dev Server

```bash
npm start
```

- Angular dev server: `http://localhost:4200`
- `/api/**` proxied to `http://localhost:8080/api/**` (if proxy is configured).

---

## 6. Authentication Flow

1. **Signup (optional)**
   - User completes form → `AuthService.signup()` → `POST /api/users/signup`.

2. **Login**
   - User submits credentials in `LoginComponent`.
   - `AuthService.login()` → `POST /api/auth/login`.
   - On success:
     - Token is extracted from `Authorization` header or body.
     - Token and current username are stored in `localStorage`.

3. **Protected Routes**
   - `AuthGuard` checks:
     - `authService.getToken()` is non‑null.
     - `!authService.isTokenExpired()` using `jwt-decode`.
   - If invalid → redirect to `/login`.

4. **Expired/Invalid Tokens**
   - Backend returns `401` or `403`.
   - `ErrorInterceptor`:
     - Invokes `AuthService.logout()`.
     - Navigates to `/login`.

---

## 7. Cars UI / UX

- **Top navigation bar**
  - Application name.
  - Navigation links (Dashboard, Cars, etc. – customizable).
  - User avatar / menu with Logout.

- **Cars list**
  - Material table with:
    - Sortable headers (MatSort).
    - Paginator (MatPaginator).
    - Search input bound to `MatTableDataSource.filter`.
    - Dynamic column toggles via `MatMenu` + `MatCheckbox`.
    - Edit/Delete icons in the Actions column.

- **Dialogs**
  - `CarAddDialogComponent`:
    - Builds a reactive form from base + extra fields.
    - Sends `CarAddRequest` to backend.
  - `CarEditDialogComponent`:
    - Pre-fills form with existing car data.
    - Sends `CarUpdateRequest` to backend.

Dynamic form configuration is driven by type-specific configs (`sedan.config.ts`, `suv.config.ts`, `truck.config.ts`), which map `CarType` to additional fields and validators. This allows adding new car types in a single place without changing component logic.

---

## 8. Testing

- **Unit tests**
  - Components: login, signup, user profile, car list, dialogs.
  - Services: `AuthService`, `CarService`.
  - Interceptors: `JwtInterceptor`, `ErrorInterceptor`.
- **E2E tests**
  - Scenarios:
    - Successful login and navigation to `/cars`.
    - Creating a car and verifying presence in grid.
    - Editing a car and verifying changes.
    - Deleting a car and verifying removal.
    - Token expiry and automatic redirect to login.

---

## 9. Production Build

```bash
npm run build
```

- Output: `dist/carsell-frontend/`
- Ensure `environment.prod.ts` has correct `apiUrl` for production deployment.
- Deploy built assets to a static host or behind a reverse proxy (e.g. Nginx, Apache, or embedded in Spring Boot).

---

## 10. Summary

This frontend showcases a **modern Angular 19** architecture:

- Standalone components with clear separation of concerns.
- New `provideHttpClient` API, `withFetch`, and `withInterceptorsFromDi`.
- Strongly‑typed, polymorphic car models for SEDAN, SUV, TRUCK.
- Professional UI built with Angular Material and reactive forms.
- Robust authentication model with JWT, interceptors, guards, and graceful token expiry handling.

The design is optimized for maintainability and extensibility, allowing new car types or UI flows to be added with minimal changes to existing code.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

**Dimitry Ivaniuta** — [dzmitry.ivaniuta.services@gmail.com](mailto:dzmitry.ivaniuta.services@gmail.com) — [GitHub](https://github.com/DimitryIvaniuta)
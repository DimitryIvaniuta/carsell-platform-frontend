import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withXsrfConfiguration, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
// (Optional) import custom interceptors if needed
// import { MyCustomInterceptor } from './app/interceptors/my-custom-interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),importProvidersFrom(BrowserAnimationsModule),
    provideRouter(routes),
    provideHttpClient(
      // 1) XSRF configuration
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',     // Cookie name set by your backend
        headerName: 'X-XSRF-TOKEN'    // Header name expected by your backend
      }),
      // 2) (Optional) Include your other interceptors
      withInterceptorsFromDi()
    )
  ]
}).catch(err => console.error(err));

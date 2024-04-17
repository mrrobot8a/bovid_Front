import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { withComponentInputBinding } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    // providerRouter(routes,withComponentInputBinding()),
    // provideHttpClient(withFetch(),withInterceptors([ErrorResponseInterceptor])),
  ],
}

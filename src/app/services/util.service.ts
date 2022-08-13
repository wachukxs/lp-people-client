import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { URLPaths } from '../constants.utils';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private http: HttpClient, breakpointObserver: BreakpointObserver, _snackBar: MatSnackBar) { 
  }

  private JSONHttpOptions = { // add timeout kini
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      // Authorization: 'my-auth-token'
    }),
    observe: 'response' as const,
    responseType: 'json' as const,
  };

  private TextHttpOptions = { // add timeout kini
    headers: new HttpHeaders({
      'Content-Type':  'application/text',
      // Authorization: 'my-auth-token'
    }),
    observe: 'response' as const,
    responseType: 'text' as const,
  };

  private handleError(error: HttpErrorResponse) {
    console.error('got this error', error);
    
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(error);
      
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.

    return throwError(error);
  }


  createImage(details: any) {
    console.log('signing up via', environment.baseURL + URLPaths.createImage);
    
    return this.http.post(environment.baseURL + URLPaths.createImage, details, this.JSONHttpOptions)
    .pipe(
      // retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }
}

import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiKey = 'ecea911b3487521a12211c0eeef434fb';
  private apiUrl = 'https://api.themoviedb.org/3';
  private tokenKey = 'tmdb_request_token';

  constructor(private http: HttpClient) {}

  getRequestToken() {
    const params = new HttpParams()
    .set('api_key', this.apiKey)
    return this.http.get(`${this.apiUrl}/authentication/token/new`, {params: params}).pipe(
      catchError(this.handleError)
    );
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, JSON.stringify({ token, timestamp: Date.now() }));
  }

  getToken() {
    const tokenData = localStorage.getItem(this.tokenKey);
    if (tokenData) {
      const { token, timestamp } = JSON.parse(tokenData);
      const oneHour = 3600000; // 1 hour in milliseconds
      if (Date.now() - timestamp < oneHour) {
        return token;
      } else {
        localStorage.removeItem(this.tokenKey);
      }
    }
    return null;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
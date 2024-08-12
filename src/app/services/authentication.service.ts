import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ITokenResponse } from '../core/interfaces/movie.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiKey = '17f4116782bcf156dc47f63bdeddc15d';
  private apiUrl = 'https://api.themoviedb.org/3';
  private tokenKey = 'tmdb_request_token';
  private redirectUrl = 'http://localhost:4200/catalog-movie-app/home';

  constructor(private http: HttpClient) {}

  private getRequestToken(): Promise<any> {
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http
      .get(`${this.apiUrl}/authentication/token/new`, { params: params })
      .toPromise();
  }

  private saveToken(token: string) {
    localStorage.setItem(
      this.tokenKey,
      JSON.stringify({ token, timestamp: Date.now() })
    );
  }

  private getToken() {
    const tokenData = localStorage.getItem(this.tokenKey);
    if (tokenData) {
      const { token, timestamp } = JSON.parse(tokenData);
      const oneHour = 3600000; // 1 hour in milliseconds
      if (Date.now() - timestamp < oneHour) {
        console.log('NEW token');
        return token;
      } else {
        console.log('REMOVE token');
        localStorage.removeItem(this.tokenKey);
      }
    }
    return null;
  }

  private authorizeRequestToken(requestToken: string): void {
    window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${this.redirectUrl}`;
  }

  async RequestToken() {
    const token = this.getToken();
    if (token) {
      console.log('Token is valid:', token);
      // this.authorizeRequestToken(token);
    } else {
      try {
        const response = await this.getRequestToken();
        const requestToken = response.request_token;
        this.saveToken(requestToken);
        // this.authorizeRequestToken(requestToken);
      } catch (error: any) { 
        this.handleError(error);
      }
    }
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

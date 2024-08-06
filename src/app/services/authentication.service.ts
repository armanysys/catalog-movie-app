import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ITokenResponse } from '../core/interfaces/movie.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiKey = 'ecea911b3487521a12211c0eeef434fb';
  private apiUrl = 'https://api.themoviedb.org/3';
  private tokenKey = 'tmdb_request_token';
  private redirectUrl = 'http://localhost:4200/catalog-movie-app/home';

  constructor(private http: HttpClient) {}

  getRequestToken(): Promise<any> {
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http
      .get(`${this.apiUrl}/authentication/token/new`, { params: params })
      .toPromise();
  }

  saveToken(token: string) {
    localStorage.setItem(
      this.tokenKey,
      JSON.stringify({ token, timestamp: Date.now() })
    );
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

  authorizeRequestToken(requestToken: string): void {
    window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${this.redirectUrl}`;
  }

  async RequestToken() {
    const token = this.getToken();
    if (token) {
      console.log('Token is valid:', token);
      this.authorizeRequestToken(token);
    } else {
      try {
        const response: ITokenResponse = await this.getRequestToken();
        const requestToken = response.request_token;
        this.saveToken(requestToken);
        this.authorizeRequestToken(requestToken);
      } catch (error: any) {
        this.handleError(error);
      }
    }
  }

  async createSession() {
    const token = this.getToken();
    if (token) {
      try {
        const params = new HttpParams() 
          .set('request_token', token);

        const url = `${this.apiUrl}/authentication/session/new`;
        const response: any = await this.http
          .post(url, { params: params })
          .toPromise();
        return response.session_id;
      } catch (error: any) {
        this.handleError(error);
      } finally {
        return null;
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

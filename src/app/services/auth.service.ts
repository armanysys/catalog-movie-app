import { ErrorHandler, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = '';
  private tokenKey = 'tmdb_request_token';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const token = this.RequestToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post(
        `${this.apiUrl}/authentication/token/validate_with_login`,
        {
          username,
          password,
          request_token: token,
        },
        { headers }
      )
      .pipe(
        map((response: any) => {
          // Handle response and store token
          localStorage.setItem('auth_token', response['token'] ?? null);
          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  private getRequestToken(): Promise<any> {
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http
      .get(`${this.apiUrl}/authentication/token/new`, { params: params })
      .toPromise();
  }

  async RequestToken() {
    const token = this.getToken();
    if (token) {
      console.log('token existe');
      return token;
    } else {
      try {
        console.log('new token');
        const response = await this.getRequestToken();
        const requestToken = response.request_token;
        this.saveToken(requestToken);
        return token;
      } catch (error: any) {
        this.handleError(error);
      }
    }
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

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('session_id');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  createSession(): Observable<any> {
    const authToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post(
        `${this.apiUrl}/authentication/session/new`,
        {
          request_token: authToken,
        },
        { headers }
      )
      .pipe(
        map((response: any) => {
          localStorage.setItem('session_id', response['session_id']);
          return response;
        }),
        catchError((err) => this.handleError(err))
      );
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

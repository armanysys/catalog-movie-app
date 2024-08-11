import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = '17f4116782bcf156dc47f63bdeddc15d';

  constructor(private http: HttpClient) {}


  

  login(username: string, password: string): Observable<any> {
    const token = this.getRequestToken();
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
        })
      );
  }
  
  getRequestToken(): Observable<any> {
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http
      .get(`${this.apiUrl}/authentication/token/new`, { params: params }).pipe(map((response:any)=> {
         // Handle response and store token
        //  localStorage.setItem('token_request', response['token'] ?? null);
         return response;
      }))
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_request');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

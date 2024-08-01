import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IMovie, IMovieDetails, IMovieResponse } from "../core/interfaces/movie.interface";



@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private apiKey = '';
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  getTopRatedMovies(year: string): Observable<IMovie[]> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('sort_by', 'vote_average.desc')
      .set('primary_release_year', year)
      .set('vote_count.gte', '1000')
      // .set('language', 'es-ES');
      
      const url = `${this.apiUrl}/discover/movie`;
      return this.http.get<any>(url, { params: params }).pipe(
        map((response) => response.results.slice(0, 5).map((movie: IMovie) => ({
          id:movie.id,
          title: movie.title,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        })))
      );
  }
  searchMovies(query: string, year: string, page: number, pageSize: number, sortBy: string): Observable<any> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('query', query)
      .set('year', year)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sort_by', sortBy);

      const url = `${this.apiUrl}/search/movie`;
    return this.http.get<IMovieResponse>(url, { params }).pipe(
      map(response => this.formatResponse(response))
    );
  }

  getMovieDetails(movieId: number): Observable<IMovieDetails> {
    let params = new HttpParams()
    .set('api_key', this.apiKey)
    
    const url = `${this.apiUrl}/movie`;
    return this.http.get<IMovieDetails>(`${url}/${movieId}`, { params });
  }
  
  private formatResponse(response: IMovieResponse): IMovieResponse {
    return {
      ...response,
      results: response.results.map(movie => ({
        ...movie,
        title: movie.title.trim(),
        overview: movie.overview
      }))
    };
  }
  
  
}

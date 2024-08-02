import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { IMovie, IMovieResponse } from '../../core/interfaces/movie.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  releaseYear: string = '2024'; // Change this to the desired release year
  topMovies: IMovie[] = [];
  searchMovies: IMovie[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private _moviesservices: MoviesService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._moviesservices
      .getTopRatedMovies(this.releaseYear)
      .subscribe((response) => {
        this.topMovies = response;
        this.searchMovies = response;
      });
    this._moviesservices.movieData$.subscribe((response: IMovieResponse) => {
      console.log(response);
      this.searchMovies = response?.results;
      this.currentPage = response?.page;
      this.totalPages = response?.total_pages;
    });
  }

  movieDetails(id: number) {
    this._router.navigate(['movie', id]);
  }

  onPageChange(event: any): void {
    console.log('change page');
  }
}

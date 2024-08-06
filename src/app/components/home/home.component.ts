import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { IMovie, IMovieResponse } from '../../core/interfaces/movie.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

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
    private route: ActivatedRoute,
    private router: Router,
    private _moviesservices: MoviesService,
    private _authservice: AuthenticationService,
    private _router: Router
  ) {}

  async ngOnInit() {
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

    this.route.queryParams.subscribe(async params => {
      const requestToken = params['request_token'];
      console.log(requestToken);
      if (requestToken) {
        this._authservice.saveToken(requestToken);
        const sessionId = await this._authservice.createSession();
        if (sessionId) {
          console.log('Session created:', sessionId);
          // Redirect to a different page or perform other actions
          this.router.navigate(['/home']);
        } else {
          console.log('Failed to create session');
        }
      } else {
        await this._authservice.RequestToken();
      }
    });
  }


  movieDetails(id: number) {
    this._router.navigate(['movie', id]);
  }

  onPageChange(event: any): void {
    console.log('change page');
  }
}

import { Component, Input } from '@angular/core';
import { IMovieDetails } from '../../core/interfaces/movie.interface';
import { MoviesService } from '../../services/movies.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent {
  id!: number;
  movieDetails!: IMovieDetails;

  constructor(
    private _moviesservices: MoviesService,
    private _activaterouter: ActivatedRoute
  ) {
    this._activaterouter.params.subscribe((params) => (this.id = params['id']));
  }

  ngOnInit(): void {
    console.log(this.id);
    this._moviesservices.getMovieDetails(this.id).subscribe((details) => {
      console.log(details);
      this.movieDetails = details;
    });
  }

  getGenres(): string {
    return this.movieDetails.genres.map((genre) => genre.name).join(', ');
  }
}

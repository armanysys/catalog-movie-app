import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { IMovie } from "../../core/interfaces/movie.interface";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  
  topMovies: IMovie[] = [];
  releaseYear: string = '2023'; // Change this to the desired release year

constructor( private _moviesservices:MoviesService, private _router:Router){}

ngOnInit(): void {
  this._moviesservices.getTopRatedMovies(this.releaseYear).subscribe(data => {
    this.topMovies = data;
  });
}

movieDetails(id:number){
  this._router.navigate(['movie', id]);
}
}

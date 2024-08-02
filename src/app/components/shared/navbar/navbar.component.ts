import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { MoviesService } from '../../../services/movies.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @ViewChild('profilePop') profilePop!: ElementRef;
  searchControl = new FormControl();
  movies: any[] = [];
  searchResults = new Subject<any>();

  constructor(private _moviesservices: MoviesService) {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.length > 3) {
            return this._moviesservices.search(
              query,
              '2024',
              1,
              10,
              'popularity.desc'
            );
          } else {
            return [];
          }
        })
      )
      .subscribe((response: any) => {
        this.searchResults.next(response);
      });
  }

  handleProfileClick(event: any) {
    const popover = this.profilePop.nativeElement as HTMLElement;
    popover.style.display = popover.style.display === 'none' ? 'block' : 'none';
  }
}

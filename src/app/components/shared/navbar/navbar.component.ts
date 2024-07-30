import {  Component,ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @ViewChild('profilePop') profilePop!: ElementRef;

  constructor(){}

	handleProfileClick(event:any) {
    const popover = this.profilePop.nativeElement as HTMLElement;
    popover.style.display = popover.style.display === 'none' ? 'block' : 'none';
  }
  likeMovie() {
    console.log('Liked the movie!');
  }

  addToFavorites() {
    console.log('Added to favorites!');
  }
}

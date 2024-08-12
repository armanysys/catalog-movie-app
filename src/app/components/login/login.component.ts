import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface User {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  
  constructor(private router: Router, private _authservice: AuthService) {}
  
  user: User = { username: '', password: '' };
  
  onSubmit(): void {
    this._authservice.login(this.user.username, this.user.password).subscribe(
      (response) => {
        // Maneja la respuesta exitosa (por ejemplo, guarda el token)
        console.log('Token de sesión:', response.request_token);
        // this.router.navigate(['home']); // Redirige al inicio de sesión
        // this._authservice.createSession().subscribe((sessionResponse: any) => {
        //   console.log('Session created successfully', sessionResponse);
        // }, (error: any) => {
        //   console.error('Session creation failed', error);
        // });
      },
      (error) => {
        // Maneja errores (por ejemplo, muestra un mensaje de error)
        console.log('Error al iniciar sesión:', error);
      }
    );
  }
}

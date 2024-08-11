import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  constructor(private _authservice: AuthService) {}

  onSubmit(username: string, password: string): void {
    this._authservice.login(username, password).subscribe(
      (response) => {
        // Maneja la respuesta exitosa (por ejemplo, guarda el token)
        console.log('Token de sesión:', response.request_token);
      },
      (error) => {
        // Maneja errores (por ejemplo, muestra un mensaje de error)
        console.error('Error al iniciar sesión:', error);
      }
    );
  }
}

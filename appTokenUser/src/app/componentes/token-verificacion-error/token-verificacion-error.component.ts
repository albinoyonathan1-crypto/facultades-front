import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenVerificacionContraseniaService } from 'src/app/servicios/token-verificacion-contrasenia.service';
import { TokenVerificacionEmailService } from 'src/app/servicios/token-verificacion-email.service';

@Component({
  selector: 'app-token-verificacion-error',
  templateUrl: './token-verificacion-error.component.html',
  styleUrls: ['./token-verificacion-error.component.css']
})
export class TokenVerificacionErrorComponent implements OnInit {

  idTokenVerificador: any;
  cargando: boolean | undefined;
  email: boolean | null = null;
  contrasenia: boolean | null = null;
  exito: boolean = false;
  error: boolean = false;

  constructor(private route: ActivatedRoute, private tokenVerificacionEmail: TokenVerificacionEmailService,
    private tokenVerficicacionContrasenia: TokenVerificacionContraseniaService) { }

  ngOnInit(): void {
    this.capturarIdTokenUrl();
  }

  actualizarTokenVerificacionEmail(): void {
    this.cargando = true;
    if (this.email) {
      this.tokenVerificacionEmail.actualizarTokenVerificacion(this.idTokenVerificador)
        .subscribe({
          next: (response) => {
            console.log('Token email actualizado con éxito', response);
            this.cargando = false;
            this.exito = true;
          },
          error: (error) => {
            // Aquí se maneja el error
            console.error('Error al actualizar el token:', error);
            this.cargando = false;
            this.error = true;
          }
        });
    } else if (this.contrasenia) {
      this.tokenVerficicacionContrasenia.actualizarTokenVerificacion(this.idTokenVerificador)
        .subscribe({
          next: (response) => {
            console.log('Token contraseña actualizado con éxito', response);
            this.cargando = false;
            this.exito = true;
          },
          error: (error) => {
            // Aquí se maneja el error
            console.error('Error al actualizar el token:', error);
            this.cargando = false;
            this.error = true;
          }
        });
    }
  }

  capturarIdTokenUrl() {
    this.idTokenVerificador = this.route.snapshot.paramMap.get('idTokenVerificador');
    this.email = this.route.snapshot.queryParamMap.get('email') === 'true';
    this.contrasenia = this.route.snapshot.queryParamMap.get('contrasenia') === 'true';
    window.history.replaceState({}, document.title, window.location.pathname);
  }

}

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MensajeRetornoSimple } from 'src/app/modelo/mensaje-retorno-simple';
import { TokenVerificacionContraseniaService } from 'src/app/servicios/token-verificacion-contrasenia.service';
import { TokenVerificacionEmailService } from 'src/app/servicios/token-verificacion-email.service';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.css']
})
export class RecuperarContraseniaComponent {

  emailForm: FormGroup;
  cargando: boolean = false;
  error: boolean = false;
  exito: boolean = false;

  constructor(private tokenContrasenia: TokenVerificacionContraseniaService) {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }



  enviar(): void {
    if (this.emailForm.valid) {
      this.cargando = true;
      this.tokenContrasenia.recuperarContrasenia(this.emailForm.get('email')?.value).subscribe(
        (respuesta: MensajeRetornoSimple) => {
          // Éxito: muestra la respuesta en la consola
          this.cargando = false;
          this.exito = true;
        },
        (error) => {
          // Manejo de error: muestra el error en la consola
          console.error('Ocurrió un error al intentar recuperar la contraseña:', error);

          // Opcional: puedes mostrar un mensaje en la UI en caso de error
          this.cargando = false;
          this.error = true;
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }

}

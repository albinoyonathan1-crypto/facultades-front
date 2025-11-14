import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MensajeRetornoSimple } from 'src/app/modelo/mensaje-retorno-simple';
import { RegistroRequest } from 'src/app/modelo/registro-request';
import { PruebaService } from 'src/app/servicios/prueba.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  ngOnInit(): void {
    const idUsuario = localStorage.getItem('userID');
    if (idUsuario)
      this.router.navigate(['']);
  }


  registerForm: FormGroup;
  mostrarContrasenia = false;
  tokenCaptcha: string | undefined;
  cuentaCreada: boolean = false;
  cargando: boolean = false;
  error: boolean = false;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private pruebaService: PruebaService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.sinEspacios]],
      nick:['', [Validators.required, this.sinEspacios]],
      password: ['', [Validators.required, this.fortalezaContrasenias, this.sinEspacios]],
      repeatPassword: ['', Validators.required],
      showPassword: [false],
      recaptcha: ['', Validators.required] // Agregar campo de reCAPTCHA
    }, { validators: this.coincidenciaContrasenias });
  }

  // Validación personalizada para verificar que las contraseñas coincidan
  coincidenciaContrasenias(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const repeatPassword = form.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { concidencia: true };
  }

  //validacion para evitar espacios en blanco
  sinEspacios(control: AbstractControl): ValidationErrors | null {
    const tieneEspacios = /\s/.test(control.value); // Verifica si hay espacios en blanco
    return tieneEspacios ? { sinEspacios: true } : null; // Retorna error si hay espacios
  }


  // Validación personalizada para la fortaleza de la contraseña
  fortalezaContrasenias(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const mayuscula = /[A-Z]/.test(password);
    const miniscula = /[a-z]/.test(password);
    const numero = /\d/.test(password);
    const caracterEspecial = /[@$!%*?&#]/.test(password);
    const esValida = mayuscula && miniscula && numero && caracterEspecial;
    return esValida ? null : { contraseniaValida: true };
  }

  // Método que se ejecuta cuando se envía el formulario
  enviar() {
    if (this.registerForm.valid && this.tokenCaptcha) {
      this.cargando = true;
      const email = this.registerForm.get('email')?.value?.trim(); // Eliminar espacios
      const pass = this.registerForm.get('password')?.value.trim();
      const nickName = this.registerForm.get('nick')?.value.trim();
      const registroRequest: RegistroRequest = {
        captchaToken: this.tokenCaptcha, // Token obtenido del reCAPTCHA
        email: email,
        contrasenia: pass,
        nick:nickName
      }

      // Llamada al servicio de registro
      this.usuarioService.registro(registroRequest).subscribe(
        (mensajeRetornoSimple: MensajeRetornoSimple) => {
          this.cuentaCreada = true;
          this.cargando = false;
        },
        (error) => {
          console.error("Error en el registro: ", error.error);
          this.cargando = false;
          this.error = true;
        }
      );

    } else {
      console.log("error")
      // Si el formulario no es válido o el reCAPTCHA no ha sido resuelto
      this.registerForm.markAllAsTouched();
    }
  }

  // Método para iniciar sesión con Google
  logueoOauth(event: Event) {
    event.preventDefault();
    this.pruebaService.login();
  }

  // Método que se ejecuta cuando el reCAPTCHA es resuelto
  onCaptchaResolved($event: string) {
    this.tokenCaptcha = $event;

    this.registerForm.get('recaptcha')?.setValue(this.tokenCaptcha);
    this.registerForm.get('recaptcha')?.markAsTouched();  // Marcar como tocado
  }
}

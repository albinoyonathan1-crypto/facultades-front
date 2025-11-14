import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthLoguinResponseDTO } from 'src/app/modelo/auth-loguin-response-dto';
import { MensajeRetornoSimple } from 'src/app/modelo/mensaje-retorno-simple';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';
import { EmailService } from 'src/app/servicios/email.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { UtilService } from 'src/app/servicios/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reestablecer-contrasenia',
  templateUrl: './reestablecer-contrasenia.component.html',
  styleUrls: ['./reestablecer-contrasenia.component.css']
})
export class ReestablecerContraseniaComponent implements OnInit {
  mostrarContrasenia: any;
  role: string | null = null;
  cargando: boolean = false;
  contraseniaRestablecida: boolean = false;
  error: boolean = false;
  restablecerForm: FormGroup;
  email: string = "";

  constructor(private fb: FormBuilder, private util: UtilService, private usuarioService: UsuarioService, private emailService: EmailService, private router: Router) {
    this.restablecerForm = this.fb.group(
      {
        password: ['', [Validators.required, this.fortalezaContrasenias]],
        repeatPassword: ['', Validators.required],
      }, { validators: this.coincidenciaContrasenias });
  }

  ngOnInit(): void {
    this.role = this.obtenerRoleDeLocalStorage();
    const params = this.obtenerParametrosDeURL();

    if (this.validarParametros(params.token, params.role, params.idUsuario)) {
      const authLoguinResponseDTO = this.crearAuthLoguinResponseDTO(params);
      this.actualizarEstadoHistorial();
      this.guardarCredencialesEnSesion(authLoguinResponseDTO);
      this.obtenerEmail(authLoguinResponseDTO.id!);
    }
  }

  private obtenerEmail(IdUsuario: number) {
    this.usuarioService.getUsuarioById(IdUsuario).subscribe(
      (usuario: UsuarioDTO) => {
        this.email = usuario.username!;
      }
    )
  }

  private obtenerRoleDeLocalStorage(): string | null {
    return localStorage.getItem('userRole');
  }

  private obtenerParametrosDeURL(): { token: string | null, role: string | null, idUsuario: string | null } {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      token: urlParams.get('token'),
      role: urlParams.get('role'),
      idUsuario: urlParams.get('idUsuario')
    };
  }

  private validarParametros(token: string | null, role: string | null, idUsuario: string | null): boolean {
    return !!(token && role && idUsuario);
  }

  private crearAuthLoguinResponseDTO(params: { token: string | null, role: string | null, idUsuario: string | null }): AuthLoguinResponseDTO {
    return {
      role: params.role!,
      token: params.token!,
      id: Number(params.idUsuario)
    };
  }

  private actualizarEstadoHistorial(): void {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  private guardarCredencialesEnSesion(authLoguinResponseDTO: AuthLoguinResponseDTO): void {
    this.util.agregarCredencialesASesion(authLoguinResponseDTO);
  }


  coincidenciaContrasenias(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const repeatPassword = form.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { concidencia: true };
  }


  fortalezaContrasenias(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const mayuscula = /[A-Z]/.test(password);
    const miniscula = /[a-z]/.test(password);
    const numero = /\d/.test(password);
    const caracterEspecial = /[@$!%*?&#]/.test(password);
    const esValida = mayuscula && miniscula && numero && caracterEspecial;
    return esValida ? null : { contraseniaValida: true };
  }


  enviar() {
    if (this.restablecerForm.valid) {
      this.cargando = true;
      const userID = Number(localStorage.getItem('userID'));
      const nuevaContrasenia = this.restablecerForm.get('password')?.value;
      this.cambiarContrasenia(userID, nuevaContrasenia);

    }
  }


  
  private cambiarContrasenia(userID: number, nuevaContrasenia: string) {
    this.usuarioService.cambiarContrasenia(userID, nuevaContrasenia).subscribe({
      next: (respuesta: MensajeRetornoSimple) => {
        this.enviarEmail(nuevaContrasenia);
  
      },
      error: (error) => {
        this.manejarError("Error al cambiar la contraseña:", error);
      }
    });
  }
  
  private enviarEmail(nuevaContrasenia: string) {
    this.emailService.enviarEmail(this.email, "Contraseña modificada", `Tu nueva contraseña es: ${nuevaContrasenia}`)
      .subscribe({
        next: (respuesta: MensajeRetornoSimple) => {
          console.log(respuesta);
          this.finalizarProceso();
        },
        error: (error) => {
          this.manejarError("Error al enviar el correo:", error);
        }
      });
  }
  
  private finalizarProceso() {
    this.contraseniaRestablecida = true;
    this.cargando = false;
    setTimeout(() => {
      this.router.navigate(['']);
    }, 3000);
  }
  
  private manejarError(message: string, error: any) {
    console.error(message, error);
    this.error = true;
    this.cargando = false;
  }
  

  }



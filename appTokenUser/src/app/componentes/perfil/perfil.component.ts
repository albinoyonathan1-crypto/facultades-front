import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthLoguinResponseDTO } from 'src/app/modelo/auth-loguin-response-dto';
import { MensajeRetornoSimple } from 'src/app/modelo/mensaje-retorno-simple';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { UtilService } from 'src/app/servicios/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {

  role: string | null = null;
  idUsuario: number = 0;
  usuario: UsuarioDTO | undefined;
  editarImagen: boolean = false;
  nuevaImagenPerfil: string | undefined;
  cambioContrasenia: boolean = true;
  formularioCambioContrasenia!: FormGroup;
  mostrarContrasenia = false;
  formularioContrasenia = false;
  infoRol: boolean = false;
  rolUsuario: string = "";
  constructor(private util: UtilService, private usuarioService: UsuarioService, private fb: FormBuilder, private alertas: AlertasService) { }

  ngOnInit(): void {
    this.obtenerIdLocalStorage();
    this.cargarUsuario();
    this.iniciarFormularioCambioContrasenia();
    this.rolUsuario = localStorage.getItem('userRole')!;
  }

  iniciarFormularioCambioContrasenia() {
    this.formularioCambioContrasenia = this.fb.group({
      nuevaContrasenia: ['', [Validators.required, this.fortalezaContrasenias]],
      repetirContrasenia: ['', Validators.required],
      contraseniaActual: ["", Validators.required]
    }, { validators: this.coincidenciaContrasenias });
  }

  coincidenciaContrasenias(form: AbstractControl): ValidationErrors | null {
    const password = form.get('nuevaContrasenia')?.value;
    const repeatPassword = form.get('repetirContrasenia')?.value;
    return password === repeatPassword ? null : { coincidencia: true };
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


  private obtenerIdLocalStorage() {
    this.idUsuario = Number(localStorage.getItem('userID'))
  }


  enviarFormularioCambioContrasenias() {
    if (this.formularioCambioContrasenia.valid) {
      const nuevaContrasenia = this.formularioCambioContrasenia.get("nuevaContrasenia")?.value
      const contraseniaActual = this.formularioCambioContrasenia.get("contraseniaActual")?.value
      const idUsuario = localStorage.getItem("userID");
      this.usuarioService.actualizarContrasenia(Number(idUsuario), contraseniaActual, nuevaContrasenia).subscribe(
        (mensaje: MensajeRetornoSimple) => {
          this.alertas.mostrarAlerta(mensaje.mensaje);
          this.limpiarFormulario();
          this.formularioContrasenia = false;
        }, (error) => {
          console.error(error);
        }
      )
    } else {
      console.error("Formulario inválido")
    }
  }

  private cargarUsuario() {
    this.usuarioService.getUsuarioById(this.idUsuario).subscribe(
      (usuarioEncontrado: UsuarioDTO) => {
        this.usuario = usuarioEncontrado;
        console.log(usuarioEncontrado)
      }, (error) => {
        console.error(error);
      }
    )
  }

  cambiarImagen() {
    this.editarImagen = !this.editarImagen;
  }

  guardarNuevaImagenUsuario() {
    this.usuario!.imagen = this.nuevaImagenPerfil;
    this.usuarioService.editUsuario(this.usuario!).subscribe(
      (usuarioModificado: UsuarioDTO) => {
       this.alertas.exito("Imagen modificada")
       this.editarImagen = false;
      }, (error) => {
        console.error(error)
      }
    )
  }

  mostrarFormularioContrasenia() {
    this.formularioContrasenia = !this.formularioContrasenia;
  }

  limpiarFormulario() {
    this.formularioCambioContrasenia.patchValue({
      nuevaContrasenia: '',
      repetirContrasenia: '',
      contraseniaActual: ""
    });
  }

  mostrarInformacionRol() {
    this.infoRol = !this.infoRol;
  }

  
  manejarImagenNoCargada(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";
  }




  // ngOnInit(): void {
  //   this.role = this.obtenerRoleDeLocalStorage();
  //   const params = this.obtenerParametrosDeURL();

  //   if (this.validarParametros(params.token, params.role, params.idUsuario)) {
  //     const authLoguinResponseDTO = this.crearAuthLoguinResponseDTO(params);
  //     this.actualizarEstadoHistorial();
  //     this.guardarCredencialesEnSesion(authLoguinResponseDTO);
  //   }
  // }

  // private obtenerRoleDeLocalStorage(): string | null {
  //   return localStorage.getItem('userRole');
  // }

  // private obtenerParametrosDeURL(): { token: string | null, role: string | null, idUsuario: string | null } {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   return {
  //     token: urlParams.get('token'),
  //     role: urlParams.get('role'),
  //     idUsuario: urlParams.get('idUsuario')
  //   };
  // }

  // private validarParametros(token: string | null, role: string | null, idUsuario: string | null): boolean {
  //   return !!(token && role && idUsuario);
  // }

  // private crearAuthLoguinResponseDTO(params: { token: string | null, role: string | null, idUsuario: string | null }): AuthLoguinResponseDTO {
  //   return {
  //     role: params.role!,
  //     token: params.token!,
  //     id: Number(params.idUsuario)
  //   };
  // }

  // private actualizarEstadoHistorial(): void {
  //   window.history.replaceState({}, document.title, window.location.pathname);
  // }

  // private guardarCredencialesEnSesion(authLoguinResponseDTO: AuthLoguinResponseDTO): void {
  //   this.util.agregarCredencialesASesion(authLoguinResponseDTO);
  // }
}

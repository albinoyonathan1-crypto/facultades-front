import { Injectable } from '@angular/core';
import { AuthLoguinResponseDTO } from '../modelo/auth-loguin-response-dto';
import { Router, RouterLink } from '@angular/router';
import { SocketService } from './socket.service';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { UsuarioService } from './usuario.service';
import { Rutas } from '../enumerables/rutas';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private router: Router, private socket: SocketService, private usuarioService: UsuarioService) { }
  private baseUrl = Rutas.RUTA_BASE;

  public agregarCredencialesASesion(authLoguinResponseDTO: AuthLoguinResponseDTO) {
    if (authLoguinResponseDTO.token && authLoguinResponseDTO.role && authLoguinResponseDTO.id) {
      localStorage.clear();
      localStorage.setItem('authToken', authLoguinResponseDTO.token);
      localStorage.setItem('userRole', authLoguinResponseDTO.role);
      localStorage.setItem('userID', authLoguinResponseDTO.id.toString());

      this.usuarioService.setUserId(Number(localStorage.getItem('userID')));
      this.usuarioService.setRolUsuario(localStorage.getItem('userRole')!);
    } else {
      console.error("Ids nulos")
    }

  }

  redirectToHome() {
    const rol: string | null = localStorage.getItem('userRole');

    if (rol) {
      this.socket.iniciarConexionSocket(rol);
      // Redirigir inmediatamente
      this.router.navigate(['/']);
      // window.location.reload();
    } else {
      console.warn('No se encontró userID en localStorage');
      this.router.navigate(['/']);
    }
  }

  public getUrlBase() {
    return this.baseUrl;
  }

  public cuentaAtras(titulo: string, tiempo: number, callback: () => void): void {
    let timerInterval: any // Define el tipo para el intervalo del temporizador
    Swal.fire({
      title: titulo,
      html: "Serás redirigido en <b></b>.",
      timer: tiempo,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup()?.querySelector("b") as HTMLElement; // Usa 'as HTMLElement' para asegurar el tipo
        timerInterval = setInterval(() => {
          if (Swal.getTimerLeft) { // Verifica que la función esté disponible
            timer.textContent = `${Swal.getTimerLeft()}`;
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      // Manejo de despidos
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
        if (callback)
          callback();
      }

    });
  }

  public verificarTokenInactivo(): boolean {
    const token = localStorage.getItem('authToken');
    const expiracionEnSegundos = jwtDecode(token!).exp;
    const expiracionEnMilisegundos = expiracionEnSegundos! * 1000; // Convertir a milisegundos
    const fechaExpiracion = new Date(expiracionEnMilisegundos - 60000); // Crear un objeto Date
    if (fechaExpiracion.getTime() <= Date.now())
      return true;
    return false;
  }


}

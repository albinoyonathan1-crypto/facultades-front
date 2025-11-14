
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { UtilService } from '../servicios/util.service';
import { UsuarioService } from '../servicios/usuario.service';
import { AuthLoguinResponseDTO } from '../modelo/auth-loguin-response-dto';

import { ErrorServiceService } from '../servicios/error-service.service';
import { UsuarioDTO } from '../modelo/UsuarioDTO';
import { AlertasService } from '../servicios/alertas.service';
import { SonidoService } from '../servicios/sonido-service.service';
import { MensajeRetornoSimple } from '../modelo/mensaje-retorno-simple';
import { SocketService } from '../servicios/socket.service';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private util: UtilService,
    private usuarioService: UsuarioService,
    private errorService: ErrorServiceService,
    private alertaService: AlertasService,
    private sonidoService: SonidoService,
    private socketService: SocketService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Verificar si la solicitud contiene el encabezado 'Skip-Interceptor'.
    const skipInterceptor = request.headers.has('Skip-Interceptor');
    if (skipInterceptor) {
      const modifiedRequest = request.clone({
        headers: request.headers.delete('Skip-Interceptor'),
        // setHeaders: {
        //   'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
        // }
      });
      return next.handle(modifiedRequest).pipe(
        catchError(error => this.handleError(error)) // Manejo de errores aquí
      );
    }
    // Obtener el token de autenticación (authToken) almacenado en localStorage.
    const authToken = localStorage.getItem('authToken');

    // Si el authToken existe, se compeurba si ha expirado.
    if (authToken) {
      if (this.util.verificarTokenInactivo()) {
        // Si el token está inactivo (ha expirado), se renuvea usando el refresh token.
        return this.refreshToken(request, next);
      } else {
        // Si el token es válido, agregar el authToken a la solicitud directamente.
        const cloneRequest = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${authToken}` // agreagr el authToken directamente en el encabezado.
          }
        });
        return next.handle(cloneRequest).pipe(
          // En caso de error, manejar el error a través de handleError.
          catchError(error => this.handleError(error))
        );
      }
    }
    // Si no hay authToken, manejar la solicitud sin agregar encabezados.
    return next.handle(request).pipe(
      catchError(error => this.handleError(error))
    );
  }
  private refreshToken(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const idUsuario = localStorage.getItem("userID");


    // Si no hay ID de usuario, se lanza un error.
    if (!idUsuario) {
      return throwError(() => new Error('No hay ID de usuario disponible'));
    }


    // Obtiene el usuario y su refreshToken
    return this.usuarioService.obtenerRefreshTokenPorUsuario(idUsuario).pipe(
      switchMap((mensajeRetornoSimple: MensajeRetornoSimple) => {
        const refreshToken = mensajeRetornoSimple?.mensaje;

        // Si no hay refresh token, se lanza un error.
        if (!refreshToken) {
          return throwError(() => new Error('No hay refresh token disponible'));
        }

        // Se realiza la solicitud de renovación del token usando el refresh token.
        return this.usuarioService.refreshToken(refreshToken);
      }),
      switchMap((authResponse: AuthLoguinResponseDTO) => {
        // Guardamos las nuevas credenciales en la sesión (por ejemplo, authToken y refreshToken).
        this.util.agregarCredencialesASesion(authResponse);

        // Clonamos la solicitud original con el nuevo token de autenticación.
        const cloneRequest = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${authResponse.token}` // Añadimos el nuevo authToken directamente en el encabezado.
          }
        });

        return next.handle(cloneRequest); // Procesamos la solicitud con el nuevo token.
      }),
      catchError(error => this.handleError(error)) // Manejo de errores de manera simplificada
    );
  }

  private handleError(error: any): Observable<never> {
    // Maneja el error, simplificado
    this.sonidoService.error();


    let mensajeError = 'Ocurrió un error desconocido';
    if (error.error?.code && error.error?.message) {
      mensajeError = `Código ${error.error.code}: ${error.error.message}`;
    } else if (error instanceof ErrorEvent) {
      mensajeError = `Error del cliente: ${error.message}`;
    } else {
      mensajeError = `Error del servidor: ${error.status} - ${error.message}`;
    }

    if (error?.error?.message === 'Token inválido') {
      mensajeError = "El token ha expirado, necesitas volver a loguarte"
      localStorage.clear();
      this.socketService.desconectarYDesuscribir();
      this.router.navigate(['/loguin']);
    } else if (error?.error?.code === 403 && error?.error?.message === "La cuenta del usuario está bloqueada.") {
      this.alertaService.error(error?.error?.message);
    } else {
      this.alertaService.error(mensajeError);
    }


    return throwError(() => new Error(mensajeError));
  }
}  
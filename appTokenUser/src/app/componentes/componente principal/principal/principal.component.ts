import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthLoguinResponseDTO } from 'src/app/modelo/auth-loguin-response-dto';
import { SocketService } from 'src/app/servicios/socket.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { UtilService } from 'src/app/servicios/util.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit, OnDestroy {

  role: string | null = localStorage.getItem('userRole');
  idUsuarioLogueado: number | undefined;
  idActual: number | undefined;
  public destroy$ = new Subject<void>();
  constructor(private util: UtilService, private socketService: SocketService, private usuarioService: UsuarioService) { }


  ngOnInit(): void {
    this.manejarParametrosUrl();
    this.idUsuarioLogueado = Number(localStorage.getItem("userID"));
    this.obtenerIdUsuarioActual();
  }


  ngOnDestroy(): void {
   this.destroy$.next();
   this.destroy$.complete();
  }

  private obtenerIdUsuarioActual() {
    this.usuarioService.idUsuarioActual
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (id) => {
          if (id)
            this.idActual = id;
        }
      )
  }


  private manejarParametrosUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const role = urlParams.get('role');
    const idUsuario = urlParams.get('idUsuario');

    if (this.validarParametrosUrl(token, role, idUsuario)) {
      const authLoguinResponseDTO: AuthLoguinResponseDTO = {
        role: role!,
        token: token!,
        id: Number(idUsuario)
      };

      this.util.agregarCredencialesASesion(authLoguinResponseDTO);
      this.util.redirectToHome();
      // Limpiar los parámetros de la URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }

  private validarParametrosUrl(token: string | null, role: string | null, idUsuario: string | null): boolean {
    return token !== null && role !== null && idUsuario !== null && !isNaN(Number(idUsuario));
  }
}

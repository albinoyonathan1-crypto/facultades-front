import { Component } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { CalificacionDTO } from 'src/app/modelo/calificacion';
import { ComentarioDTO } from 'src/app/modelo/ComentarioDTO';
import { ReaccionDTO } from 'src/app/modelo/ReaccionDTO';
import { RefreshTokenDTO } from 'src/app/modelo/RefreshTokenDTO';
import { RolDTO } from 'src/app/modelo/RolDTO';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';

import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
  mensajeError!: string;

  constructor(private usuarioService: UsuarioService) { }

  getUsuarios() {
    this.usuarioService.getUsuarios()
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error;
          return EMPTY;
        })
      ).subscribe({
        next: (usuarios) => {
          console.log(usuarios);
        }
      })
  }

  getUsuarioById(id: number) {
    this.usuarioService.getUsuarioById(id)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (usuario) => {
          console.log(usuario);
        }
      })
  }

  crearUsuario(nombreUsuario: string, contrasenia: string) {
    const usuarioAGuardar: UsuarioDTO = {
      username: nombreUsuario,
      password: contrasenia
    }

    this.usuarioService.crearUsuario(usuarioAGuardar)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (usuario) => {
          console.log(usuario);
        }
      })
  }

  editUsuario(
    id: number,
    username?: string,
    password?: string,
    enable?: boolean,
    accountNotExpired?: boolean,
    accountNotLocked?: boolean,
    credentialNotExpired?: boolean,
    listaRoles?: RolDTO[],
    listaUniversidad?: UniversidadDTO[],
    listaCalificacion?: CalificacionDTO[],
    refreshToken?: RefreshTokenDTO,
    listaComentarios?: ComentarioDTO[],
    listaReaccion?: ReaccionDTO[]
  ) {
    const usuarioEdit: UsuarioDTO = {
      id: id,
      username: username || '',
      //password: password || '',
      enable: enable ?? true,
      accountNotExpired: accountNotExpired ?? true,
      accountNotLocked: accountNotLocked ?? true,
      credentialNotExpired: credentialNotExpired ?? true,
      listaRoles: listaRoles || [],
      listaUniversidad: listaUniversidad || [],
      listaCalificacion: listaCalificacion || [],
      refreshToken: refreshToken,
      listaComentarios: listaComentarios || [],
      listaReaccion: listaReaccion || []
    };

    this.usuarioService.editUsuario(usuarioEdit)
      .subscribe({
        next: (usuario) => {
          console.log(usuario);
        }
      })
  }


}

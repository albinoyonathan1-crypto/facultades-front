import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { NotificacionDTO } from 'src/app/modelo/NotificacionDTO';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';
import { AlertasService } from 'src/app/servicios/alertas.service';

import { NotificacionService } from 'src/app/servicios/notificacion.service';
import { SocketService } from 'src/app/servicios/socket.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
})
export class NotificacionesComponent implements OnInit {
  notificaciones: NotificacionDTO[] = [];
  listaFiltrada: NotificacionDTO[] = [];
  idUsuario: number = Number(localStorage.getItem('userID'));
  mensajeError!: string;
  eliminando: boolean = false;
  filtroSeleccionado: string = 'general';
  admin: boolean = false;

  constructor(
    private notificacionService: NotificacionService,
    private userService: UsuarioService,
    private router: Router,
    private alertaService: AlertasService
  ) { }

  ngOnInit(): void {
    this.getnotificationsByIdUser(this.idUsuario);
    this.userService.isAdmin(this.idUsuario).subscribe(
      (admin: boolean) => {
        this.admin = admin;
      }
    )
    //this.visualizarNotificacionesByUserID(); 
    this.notificacionService.visualizarNotificacionesByUserID(this.idUsuario).subscribe();

  }

  irADetalleNotificacion(notificacion: NotificacionDTO) {
    if (notificacion.comentarioAgregadoCarrera) {
      this.router.navigate(
        ['/detalleUniversidad', notificacion.idRedireccionamiento])
    } else {
      if (notificacion.publicacionComentada) {
        if (notificacion.universidad) {
          this.router.navigate(
            ['/detalleUniversidad', notificacion.idRedireccionamiento])
        }
        if (notificacion.carrera) {
          this.router.navigate(['detalleUniversidad', notificacion.idRedireccionamiento], { queryParams: { carrera: true } });
        }
      } else {
        this.router.navigate(
          ['/detalleNotificacion', notificacion.idRedireccionamiento, notificacion.id],
          {
            state: {
              carrera: notificacion.carrera,
              comentario: notificacion.comentario,
              usuario: notificacion.usuario,
              universidad: notificacion.universidad,
              permiso: notificacion.permiso,
              respuesta: notificacion.respuesta,
              respuestaComentarioRecibida: notificacion.respuestaComentarioRecibida,
              respuestaAunaRespuesta: notificacion.respuestaAunaRespuesta,
              carreraAgregada: notificacion.carreraAgregada,
              comentarioAgregadoCarrera: notificacion.comentarioAgregadoCarrera
            },
          }
        );
      }
    }
  }

  getnotificationsByIdUser(idUsuario: number) {
    this.notificacionService.getNotificacionesByUserId(idUsuario).subscribe(
      (notificaciones: NotificacionDTO[]) => {
        this.notificaciones = notificaciones;
        this.filtrarNotificaciones(true, false, false, "general");
      },
      (error) => {
        console.error('Error al obtener las notificaciones:', error);
      }
    );
  }


  filtrarNotificaciones(general: boolean, respuesta: boolean, auditoria: boolean, tipo: string) {
    this.listaFiltrada = [];
    this.filtroSeleccionado = tipo;
    if (general) {
      this.notificaciones.forEach((notificacion) => {
        if (notificacion.publicacionComentada || notificacion.carreraAgregada || notificacion.comentarioAgregadoCarrera) {
          this.listaFiltrada.push(notificacion);
        }
      });
    }

    if (respuesta) {
      this.notificaciones.forEach((notificacion) => {
        if (notificacion.respuestaComentarioRecibida || notificacion.respuestaAunaRespuesta) {
          this.listaFiltrada.push(notificacion);
        }
      });
    }

    if (auditoria) {
      this.notificaciones.forEach((notificacion) => {
        if (!notificacion.publicacionComentada && !notificacion.carreraAgregada) {
          if (notificacion.universidad || notificacion.carrera || notificacion.comentario || notificacion.respuesta) {
            this.listaFiltrada.push(notificacion);
          }
        }
      });
    }
    console.log(this.notificaciones)
  }

  getNotificaciones() {
    this.notificacionService
      .getNotificaciones()
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error;
          return EMPTY;
        })
      )
      .subscribe({
        next: (notificaciones) => {
          console.log(notificaciones);
        },
      });
  }

  getNotificacionById(id: number) {
    this.notificacionService
      .getNotificacionById(id)
      .pipe(
        catchError((eror: string) => {
          this.mensajeError = eror;
          return EMPTY;
        })
      )
      .subscribe({
        next: (notificacion) => {
          console.log(notificacion);
        },
      });
  }


  crearNotificacion(
    informacion?: string,
    idRedireccionamiento?: string,
    listaUsuarios?: UsuarioDTO[],
    leida?: boolean
  ) {
    const notificacionCreada: NotificacionDTO = {
      informacion: informacion,
    };
    this.notificacionService
      .crearNotificacion(notificacionCreada)
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error;
          return EMPTY;
        })
      )
      .subscribe({
        next: (notificacion) => {
          console.log(notificacion);
        },
      });
  }

  eliminarNotificacion(notificacion: NotificacionDTO) {
    if (notificacion && notificacion.listaUsuariosIds) {
      this.actualizarListaUsuariosIds(notificacion);
    }
  }

  visualizarNotificacionesByUserID() {
    this.alertaService.mostrarDialogoDeConfirmacion(() => {
      if (this.notificaciones) {
        this.notificaciones.forEach((notificacion) => {
          if (notificacion.listaUsuariosIds) {
            this.actualizarListaUsuariosIds(notificacion);
          }
        });
      }
    })

  }

  // Método para actualizar la lista de IDs de usuarios
  private actualizarListaUsuariosIds(notificacion: NotificacionDTO) {
    if (notificacion.listaUsuariosIds) {
      const nuevoListaUsuariosIds = notificacion.listaUsuariosIds.filter(id => id !== this.idUsuario);

      // Solo actualiza si hay cambios en la lista
      if (nuevoListaUsuariosIds.length !== notificacion.listaUsuariosIds.length) {
        notificacion.listaUsuariosIds = nuevoListaUsuariosIds;

        this.notificacionService.editNotificacion(notificacion).subscribe(
          () => {
            this.getnotificationsByIdUser(this.idUsuario);
          },
          (error) => {
            console.error('Error al actualizar la notificación:', error);
          }
        );
      }
    }
  }


}


import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UsuarioRecord } from 'src/app/modelo/usuario-record';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';
import { SocketService } from 'src/app/servicios/socket.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {

  listausuariosOnline: UsuarioRecord[] = [];
  idUsuarioActual: number = Number(localStorage.getItem('userID'))!;
  usuarioChat?: UsuarioDTO;
  online?: boolean;

  //private destroy$ = new Subject<void>(); // Para limpiar suscripciones

  constructor(private socketService: SocketService, private usuarioService: UsuarioService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.inicializarChat();
  }



  private inicializarChat(): void {
    this.actualizarUsuariosOnline();
    this.escucharActualizacionMensajes();
    this.escucharEliminacionNotificaciones();
  }

  private actualizarUsuariosOnline(): void {
    this.socketService.obtenerConexiones().subscribe(
      (usuarios) => {
        this.agregarUsuarioSiNoEsta(usuarios);
        this.obtenerEntidadUsuariosPorIds(usuarios);
      },
      (error) => console.error('Error al obtener usuarios:', error)
    );

    this.socketService.estadoConexiones.subscribe(
      (usuarios) => {
        this.agregarUsuarioSiNoEsta(usuarios);
        this.obtenerEntidadUsuariosPorIds(usuarios);
      },
      (error) => console.error('Error al obtener usuarios:', error)
    );
  }

  private escucharActualizacionMensajes(): void {
    this.socketService.actualizarListaMensajeNuevo.subscribe(() => this.actualizarUsuariosOnline());
  }

  private escucharEliminacionNotificaciones(): void {
    this.socketService.actulizacionNotificacionEliminadaAsObservable.subscribe(() => this.actualizarUsuariosOnline());
  }

  private obtenerEntidadUsuariosPorIds(ids: string[]): void {
    this.usuarioService.buscarUsuariosPorListIds(ids).subscribe(
      (usuariosLogueados) => {
        this.buscarTodosLosUsuarios().subscribe(
          (usuariosEnBd) => {
            this.listausuariosOnline = this.ordenarUsuarios(this.analizarUsuariosLogueados(usuariosEnBd, usuariosLogueados));
          },
          (error) => console.error('Error al obtener usuarios de la base de datos:', error)
        );
      },
      (error) => console.error('Error al obtener usuarios logueados:', error)
    );
  }

  private agregarUsuarioSiNoEsta(usuariosOnline: string[]): void {
    if (!usuariosOnline.includes(this.idUsuarioActual.toString())) {
      usuariosOnline.push(this.idUsuarioActual.toString());
    }
  }

  public capturarIdUsuario(id: number, online: boolean): void {
    if (id !== this.idUsuarioActual) {

      this.usuarioService.getUsuarioById(id).subscribe(
        (usuario) => {
          this.usuarioChat = usuario;
          this.online = online;
          this.verificarNotificacionMiUsuario(id);
          this.cdr.detectChanges(); 
        },
        (error) => console.error('Error al obtener usuario por ID:', error)
      );
    }

  }

  private verificarNotificacionMiUsuario(id: number): void {
    const usuario = this.listausuariosOnline.find((user) => user.id === id);
    if (usuario?.idsUsuariosNotificar?.includes(this.idUsuarioActual)) {
      this.usuarioService.eliminarNotificacionUsuarioId(id, this.idUsuarioActual).subscribe();
    }
  }

  private buscarTodosLosUsuarios(): Observable<UsuarioRecord[]> {
    return this.usuarioService.buscarTodosLosUsuarios();
  }

  private analizarUsuariosLogueados(todosUsuarios: UsuarioRecord[], usuariosLogueados: UsuarioRecord[]): UsuarioRecord[] {
    const idsLogueados = new Set(usuariosLogueados.map((user) => user.id));
    return todosUsuarios.map((user) => ({ ...user, online: idsLogueados.has(user.id) }));
  }

  private ordenarUsuarios(usuarios: UsuarioRecord[]): UsuarioRecord[] {
    return usuarios.sort((a, b) => {
      if (a.id === this.idUsuarioActual) return -1;
      if (this.verificarNotificacion(a.idsUsuariosNotificar!) && this.verificarNotificacion(b.idsUsuariosNotificar!)) return -1;
      if (a.online && !b.online) return -1;
      if (!a.online && b.online) return 1;
      return 0;
    });
  }

  public verificarNotificacion(listaIdsUsuariosNotificacion: number[]): boolean {
    return listaIdsUsuariosNotificacion.includes(this.idUsuarioActual);
  }



}

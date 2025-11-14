import { Component, OnInit } from '@angular/core';
import { NotificacionDTO } from 'src/app/modelo/NotificacionDTO';
import { NotificacionService } from 'src/app/servicios/notificacion.service';


import { SocketService } from 'src/app/servicios/socket.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-esucha-socket',
  templateUrl: './esucha-socket.component.html',
  styleUrls: ['./esucha-socket.component.css']
})
export class EsuchaSocketComponent implements OnInit {
  notificaciones: number = 0;

  constructor(
    private socketService: SocketService,
    private usuarioService: UsuarioService,
    private notificacionesService:NotificacionService
  ) {}

  ngOnInit() {
    this.usuarioService.idUsuarioActual.subscribe(idUsuario => {
      if (idUsuario !== null && idUsuario !== 0) {
        this.escucharSocket(idUsuario);
        this.notificacionesService.getNotificacionesNoLeidas(idUsuario)
          .subscribe((notificaciones: NotificacionDTO[]) => {
            this.notificaciones = notificaciones.length;
          });
      }
    });
  }

  escucharSocket(idUser: number) {
    const topic = `/tema/admin/notificacion`;  // Aquí puedes personalizar el topic
    if (this.socketService.getMessages(topic)) {
      this.socketService.getMessages(topic).subscribe((mensaje) => {
        this.notificaciones++;
      });
    } else {
      console.error(`El topic ${topic} no está disponible aún.`);
    }
  }
}

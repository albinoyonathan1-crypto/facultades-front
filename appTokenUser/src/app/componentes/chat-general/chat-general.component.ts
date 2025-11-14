import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MensajeGeneralRecord } from 'src/app/modelo/mensaje-general-record';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';
import { SocketService } from 'src/app/servicios/socket.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-chat-general',
  templateUrl: './chat-general.component.html',
  styleUrls: ['./chat-general.component.css']
})
export class ChatGeneralComponent implements OnInit, OnDestroy {
  listaMensajes: MensajeGeneralRecord[] = [];
  nuevoMensaje: string = "";
  idUsuarioActual: number | undefined;
  usuarioActual: UsuarioDTO | undefined;
  private destroy$ = new Subject<void>();
  colores: Map<string, string> = new Map();
  estaSuscrito: boolean = false;
  chatMinimizado: boolean = false;
  mensajeExtenso: boolean = false;
  caracteresPermitidos:number = 250;
  constructor(private socketService: SocketService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.obtenerIdUsuarioActual();
    this.suscribirseAlSubjectChatGeneral();
  }

  obtenerUsuarioActualById(id: number) {
    this.usuarioService.getUsuarioById(id).subscribe(
      (usuario) => {
        this.usuarioActual = usuario;
      }
    )
  }

  obtenerIdUsuarioActual() {
    this.usuarioService.idUsuarioActual.subscribe(
      (id) => {
        if (id) {
          this.idUsuarioActual = id!;
          this.obtenerUsuarioActualById(id);
        }
      }
    )
  }

  public suscribirseAlSubjectChatGeneral() {
    if (!this.estaSuscrito) {
      this.estaSuscrito = true;
      this.socketService.mensajesGeneralesAsObservable
        .pipe(takeUntil(this.destroy$))
        .subscribe((mensaje) => {
          this.asignarColorMensaje(mensaje);
          this.listaMensajes.push(mensaje);
        });
    }
  }

  private asignarColorMensaje(mensaje: MensajeGeneralRecord) {
    if (!this.colores.has(mensaje.nickUser!)) {
      this.colores.set(mensaje.nickUser!, this.obtenerColor());
    }
  }

  public enviarMensaje() {
    if (this.validacionLargoMensaje(this.nuevoMensaje)) {
      this.mensajeExtenso = true;
      return;
    } else {
      this.mensajeExtenso = false;
    }

    if (this.usuarioActual) {
      const mensaje: MensajeGeneralRecord = {
        nickUser: this.usuarioActual.nick,
        mensaje: this.nuevoMensaje
      }
      this.socketService.enviarMensajeChatGeneral(mensaje);
    }
    this.nuevoMensaje = "";
    this.caracteresPermitidos = 250;
  }

  validacionLargoMensaje(mensaje: string): boolean {
    if (mensaje.length > 250)
      return true;
    return false;
  }

  trackByNick(index: number, mensaje: MensajeGeneralRecord): string {
    return mensaje.nickUser!;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  obtenerColorAleatorio(): string {
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  obtenerColor(): string {
    return this.obtenerColorAleatorio();
  }

  obtenerColorHtml(nick: string) {
    if (nick && this.colores.has(nick)) {
      return this.colores.get(nick);
    }
    return '#000000';
  }

  toggleMinimizarChat() {
    this.chatMinimizado = !this.chatMinimizado;
  }

  descontarCaracteres(mensaje: string, event: KeyboardEvent) {
    if (event.key === "Backspace" || event.key === "Delete") {
      if (this.caracteresPermitidos < 250)
        this.caracteresPermitidos++;
    } else if(this.caracteresPermitidos > 0 )
      this.caracteresPermitidos = (250 - mensaje.length) - 1;
  }
}

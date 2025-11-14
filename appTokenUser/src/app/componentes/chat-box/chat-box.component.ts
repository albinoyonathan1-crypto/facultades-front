import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';
import { MensajeDTO } from 'src/app/modelo/mensaje-dto';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';
import { MensajeService } from 'src/app/servicios/mensaje.service';
import { SocketService } from 'src/app/servicios/socket.service';
import { SonidoService } from 'src/app/servicios/sonido-service.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit, OnDestroy, OnChanges {
  nuevoMensaje: string = '';
  listaMensajes: MensajeDTO[] = [];
  @Input() usuario: UsuarioDTO | undefined;
  @Input() online: boolean | undefined;
  idUsuarioActual: number = Number(localStorage.getItem("userID"));
  chatMinimizado: boolean = false;  // Estado del chat (minimizado o no)
  chatCerrado: boolean = true;
  mensajeExtenso: boolean = false;
  caracteresPermitidos: number = 250;
  @ViewChildren('mensaje') mensajes!: QueryList<ElementRef>;

  mensajeAgregadoAlaLista: boolean = false;

  constructor(private usuarioService: UsuarioService, private mensajeService: MensajeService, private socketService: SocketService) { }

  ngOnInit(): void {
    this.obtenerMensajesEntreUsuarios();
    this.actualizarListaMensajeRecibido();
    this.irAlUltimoMensaje();
    this.actualizarVistaMensajes();
  }

  public obtenerMensajesEntreUsuarios() {
    this.mensajeService.getMensaesEmisorReceptor(this.idUsuarioActual, this.usuario?.id!).subscribe(
      (mensajes) => {
        this.listaMensajes = mensajes;
        this.marcarMensajesReceptorVistos(mensajes);
      }
    )
  }


  private actualizarListaMensajeRecibido() {
    this.socketService.actualizarListaMensajeNuevo.subscribe(
      (mensajeSocket) => {
        this.agregarNuevoMensajeAListaMensajes(mensajeSocket);

      }
    )
  }

  irAlUltimoMensaje() {
    if (this.mensajes) {
      const ultimoMensaje = this.mensajes.last;
      if (ultimoMensaje)
        ultimoMensaje.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }


  public actualizarVistaMensajes() {
    this.socketService.actualizarMensajeLeidoAsObservable.subscribe(
      () => {
        this.obtenerMensajesEntreUsuarios();
      }
    )
  }

  // Método que se llama después de que se haya actualizado la vista
  ngAfterViewChecked() {
    // Si la lista de mensajes ha sido actualizada, desplazarse al último mensaje
    // if (this.mensajeAgregadoAlaLista) {
    this.irAlUltimoMensaje();
    this.mensajeAgregadoAlaLista = false; // Reiniciar la bandera
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario'] && changes['usuario'].currentValue) {
      this.chatCerrado = true;
      this.caracteresPermitidos = 250;
      this.nuevoMensaje = "";
      this.obtenerMensajesEntreUsuarios(); // Llama a la función para obtener mensajes del nuevo usuario
    }
  }


  public marcarMensajesReceptorVistos(listaMensajes: MensajeDTO[]) {
    let idEmisor: number = 0;
    listaMensajes.forEach(mensaje => {
      if (mensaje.idReceptor === this.idUsuarioActual && !mensaje.leida) {
        idEmisor = mensaje.idEmisor!;
        mensaje.leida = true;
        this.mensajeService.marcarMensajeLeido(mensaje.id!).subscribe();
      }
    });

    if (idEmisor != 0)
      this.actualizarMensajeLeido(idEmisor);
  }

  public actualizarMensajeLeido(idEmisor: number) {
    this.mensajeService.actualizarMensajeLeido(idEmisor).subscribe();
  }

  trackById(index: number, mensaje: MensajeDTO): number {
    return mensaje.id!;
  }

  ngOnDestroy() {
    this.socketService.desuscribirseTopic('/tema/actualizarListaMensajeRecibido/3');
  }


  agregarNuevoMensajeAListaMensajes(nuevoMensaje: MensajeDTO) {
    if (!this.listaMensajes.find(mensaje => mensaje.id === nuevoMensaje.id)) {
      if (nuevoMensaje.idEmisor === this.usuario?.id || nuevoMensaje.idReceptor === this.usuario?.id) {
        this.listaMensajes.push(nuevoMensaje);
      }
      if (this.usuario?.id === nuevoMensaje.idEmisor) {
        this.marcarMensajesReceptorVistos(this.listaMensajes);
      }
      this.mensajeAgregadoAlaLista = true;
    }
  }


  toggleMinimizarChat() {
    this.chatMinimizado = !this.chatMinimizado;
  }

  enviarMensaje() {
    if (this.validacionLargoMensaje(this.nuevoMensaje)) {
      this.mensajeExtenso = true;
      return;
    } else {
      this.mensajeExtenso = false;
    }
    const mensaje: MensajeDTO = {
      contenido: this.nuevoMensaje,
      idEmisor: Number(localStorage.getItem('userID')), // ID del emisor
      idReceptor: this.usuario?.id!, // ID del receptor
      fecha: new Date(),
      leida: false
    };

    this.mensajeService.crearMensaje(mensaje).subscribe(
      (mensaje) => {
        this.listaMensajes.push(mensaje)
        this.nuevoMensaje = ''
        this.caracteresPermitidos = 250;
      }
    )
  }

  cerrarChat() {
    this.usuario = undefined;
    this.chatCerrado = false;
  }

  validacionLargoMensaje(mensaje: string): boolean {
    if (mensaje.length > 250)
      return true;
    return false;
  }

  descontarCaracteres(mensaje: string, event: KeyboardEvent) {
    if (event.key === "Backspace" || event.key === "Delete") {
      if (this.caracteresPermitidos < 250)
        this.caracteresPermitidos++;
    } else if(this.caracteresPermitidos > 0 )
      this.caracteresPermitidos = (250 - mensaje.length) - 1;
  }
}


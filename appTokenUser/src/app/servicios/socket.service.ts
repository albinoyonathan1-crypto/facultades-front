import { Injectable, OnDestroy } from '@angular/core';
import { Stomp, CompatClient } from '@stomp/stompjs';
import { Subject, BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { UsuarioService } from './usuario.service';
import { AlertasService } from './alertas.service';
import { Rutas } from '../enumerables/rutas';
import { WebSocketConexionesService } from './web-socket-conexiones.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioRecord } from '../modelo/usuario-record';
import { MensajeRetornoSimple } from '../modelo/mensaje-retorno-simple';
import { MensajeDTO } from '../modelo/mensaje-dto';
import { SonidoService } from './sonido-service.service';
import { MensajeGeneralRecord } from '../modelo/mensaje-general-record';
import { UsuarioDTO } from '../modelo/UsuarioDTO';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  private stompClient: CompatClient | null = null;
  private readonly maxIntentosSubscribicionToken = 5;
  private intentosSubscribicionTopic = 0;
  private topics: string[] = [];
  private messageSubjects: { [topic: string]: Subject<string> } = {};
  private connectionState = new BehaviorSubject<boolean>(false); // Estado de conexión  
  private idUsuario: number | undefined;
  private readonly WEBSOCKET_URL = Rutas.RUTA_BASE;
  private baseUrl = Rutas.RUTA_BASE;
  private subscriptionMap: Map<string, any> = new Map(); //suscripciones al topic


  // Subject para emitir mensajes del topic
  private estadoConexionesSubject: Subject<string[]> = new Subject<string[]>();
  public estadoConexiones = this.estadoConexionesSubject.asObservable();

  private actualizarListaMensajeRecibido: Subject<MensajeDTO> = new Subject<MensajeDTO>();
  public actualizarListaMensajeNuevo = this.actualizarListaMensajeRecibido.asObservable();

  private actulizacionNotificacionEliminada: Subject<string> = new Subject<string>();
  public actulizacionNotificacionEliminadaAsObservable = this.actulizacionNotificacionEliminada.asObservable();

  private actualizarMensajeLeidoAtrue: Subject<boolean> = new Subject<boolean>();
  public actualizarMensajeLeidoAsObservable = this.actualizarMensajeLeidoAtrue.asObservable();



  //Subject para em
  private mensajesGenerales = new ReplaySubject<MensajeGeneralRecord>(100);
  public mensajesGeneralesAsObservable = this.mensajesGenerales.asObservable();

  isReconnecting: boolean = false;

  constructor(private userService: UsuarioService, private alertaService: AlertasService, private HttpClient: HttpClient, private sonidoService: SonidoService) {
    this.userService.idUsuarioActual.subscribe(id => {
      if (id) {
        this.idUsuario = id;
        this.userService.rolActual.subscribe(rolUsuario => {
          if (rolUsuario) {
            this.iniciarConexionSocket(rolUsuario);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.desconectarYDesuscribir(); // Limpiar la conexión WebSocket y las suscripciones
  }

  private capturarTopics(rolUsuario: string) {
    this.topics = []; // Limpiar la lista de topics previos

    // Definir los topics comunes para todos los usuarios
    const topicosComunes = [
      '/tema/chatGeneral',
      '/tema/estadoConexiones',
      '/tema/actualizarListaMensajeRecibido/' + this.idUsuario,
      '/tema/usuario/' + this.idUsuario,
      '/tema/notificacionNuevoMensajeEliminada/' + this.idUsuario,
      '/tema/actualizarMensajeLeido/' + this.idUsuario
    ];

    // Definir los topics específicos según el rol
    if (rolUsuario === 'ROLE_ADMIN') {
      this.topics.push('/tema/admin/notificacion');
    } else if (rolUsuario === 'ROLE_USER') {
      this.topics.push('/tema/usuario/notificacion');
    }

    // Agregar los topics comunes a todos los roles
    this.topics = [...this.topics, ...topicosComunes];

    // Crear un `Subject` para cada topic
    this.topics.forEach(topic => {
      this.messageSubjects[topic] = new Subject<string>();
    });
  }


  // Iniciar conexión WebSocket y esperar hasta que esté conectada
  public iniciarConexionSocket(rolUsuario: string) {
    // Verificar si ya hay una conexión activa
    if (this.stompClient && this.stompClient.connected) {
      console.log('Ya está conectado');
      return;
    }

    this.capturarTopics(rolUsuario);  // Actualiza los topics basados en el rol

    const socket = new SockJS(this.WEBSOCKET_URL + "/websocket");
    this.stompClient = Stomp.over(socket);

    const headers = {
      'userId': this.idUsuario!.toString()
    };

    //  reconexión con un número máximo de intentos
    const maxIntentos = 5;
    let intentos = 0;
    const intervaloReconectar = 3000; // Intervalo de reconexión en milisegundos

    const conectar = () => {
      this.stompClient!.connect(
        headers,  // Pasar los headers aquí
        () => {
          console.log('Conexión WebSocket establecida');
          this.isReconnecting = false;
          this.connectionState.next(true); // Emitir el estado de conexión
          this.suscribirseATopics(); // Suscribirse a múltiples topics
        },
        (error: any) => {
          console.error('Error en la conexión WebSocket: ', error);
          this.connectionState.next(false); // Emitir el estado de desconexión

          // Intentar reconectar solo si no se ha alcanzado el límite de intentos
          if (intentos < maxIntentos) {
            intentos++;
            console.log(`Reintentando conexión WebSocket (intento ${intentos}/${maxIntentos})`);
            setTimeout(conectar, intervaloReconectar * intentos); // Reintentar después de un tiempo
          } else {
            console.error('No se pudo establecer la conexión WebSocket después de varios intentos');
          }
        }
      );
    };

    // Iniciar la primera conexión
    conectar();
  }




  private suscribirseATopics() {
    if (this.stompClient?.connected) {
      this.topics.forEach(topic => {
        this.suscribirseAlTopic(topic);
      });
    } else {
      console.error('No se puede suscribir a los topics, WebSocket no está conectado');
    }
  }

  private suscribirseAlTopic(topic: string) {

    if (this.subscriptionMap.has(topic)) {
      console.warn(`Ya estás suscrito a ${topic}`);
      return;
    }


    if (topic === '/tema/chatGeneral') {
      this.suscribcionChatGeneral();
    }
    else if (topic === '/tema/actualizarMensajeLeido/' + this.idUsuario) {
      this.actualizarMensajeLeido();
    }
    else if (topic === '/tema/notificacionNuevoMensajeEliminada/' + this.idUsuario) {
      this.notificacionNuevoMensajeEliminada();
    }
    else if (topic === '/tema/estadoConexiones') {
      this.suscribirseAlTopicEstadoConexiones();
    } else if (topic === '/tema/actualizarListaMensajeRecibido/' + this.idUsuario) {
      this.suscribirseAlTopicMensajeRecibido();
    } else {
      if (this.stompClient?.connected) {
        const subscription = this.stompClient.subscribe(topic, (respuesta: any) => {
          this.subscriptionMap.set(topic, subscription);
          this.intentosSubscribicionTopic = 0;
          this.messageSubjects[topic].next(respuesta.body);
          console.log(`Mensaje en ${topic}: ${respuesta.body}`);

          const mensaje = JSON.parse(respuesta.body);
          this.alertaService.topLateral(mensaje.evento, mensaje.detalle);
        });
      } else {
        console.error(`No se puede suscribir al tópico ${topic}, WebSocket no está conectado`);
        this.reSuscribirseAlTopic(this.intentosSubscribicionTopic, topic);
      }
    }
  }

  // public actualizarMensajeLeido() {
  //   this.stompClient?.send("/app/actualizar", {});
  // }

  public desuscribirseTopic(topic: string) {
    if (this.subscriptionMap.has(topic)) {
      this.subscriptionMap.get(topic).unsubscribe();
      this.subscriptionMap.delete(topic);
      this.messageSubjects[topic]?.complete(); // Cierra el Subject
      delete this.messageSubjects[topic]; // Libera memoria
      console.log(`Desuscrito de ${topic}`);
    }
  }


  private suscribcionChatGeneral() {
    const topic = '/tema/chatGeneral';
    if (this.stompClient?.connected) {
      const subscription = this.stompClient.subscribe(topic, (respuesta: any) => {
        this.subscriptionMap.set(topic, subscription);
        this.intentosSubscribicionTopic = 0;

        const mensajeRecibido: MensajeGeneralRecord = JSON.parse(respuesta.body);
        this.mensajesGenerales.next(mensajeRecibido);
      });
    } else {
      console.error(`No se puede suscribir al tópico ${topic}, WebSocket no está conectado`);
      this.reSuscribirseAlTopic(this.intentosSubscribicionTopic, topic);
    }
  }

  private actualizarMensajeLeido() {
    const topic = '/tema/actualizarMensajeLeido/' + this.idUsuario;
    if (this.stompClient?.connected) {
      const subscription = this.stompClient.subscribe(topic, (respuesta: any) => {
        this.subscriptionMap.set(topic, subscription);
        this.intentosSubscribicionTopic = 0;

        const mensajeRecibido: boolean = JSON.parse(respuesta.body);
        this.actualizarMensajeLeidoAtrue.next(mensajeRecibido);
      });
    } else {
      console.error(`No se puede suscribir al tópico ${topic}, WebSocket no está conectado`);
      this.reSuscribirseAlTopic(this.intentosSubscribicionTopic, topic);
    }
  }

  private notificacionNuevoMensajeEliminada() {
    const topic = '/tema/notificacionNuevoMensajeEliminada/' + this.idUsuario;
    if (this.stompClient?.connected) {
      const subscription = this.stompClient.subscribe(topic, (respuesta: any) => {
        this.subscriptionMap.set(topic, subscription);
        this.intentosSubscribicionTopic = 0;
        const mensajeRecibido: MensajeRetornoSimple = JSON.parse(respuesta.body);

        this.actulizacionNotificacionEliminada.next(mensajeRecibido.mensaje);
      });
    } else {
      console.error(`No se puede suscribir al tópico ${topic}, WebSocket no está conectado`);
      this.reSuscribirseAlTopic(this.intentosSubscribicionTopic, topic);
    }
  }



  // Método para suscribirse al topic 'estadoConexiones'
  private suscribirseAlTopicEstadoConexiones() {
    const topic = '/tema/estadoConexiones';
    if (this.stompClient?.connected) {
      const subscription = this.stompClient.subscribe(topic, (respuesta: any) => {
        this.subscriptionMap.set(topic, subscription);
        this.intentosSubscribicionTopic = 0;
        this.estadoConexionesSubject.next(respuesta.body);
      });
    } else {
      console.error(`No se puede suscribir al tópico ${topic}, WebSocket no está conectado`);
      this.reSuscribirseAlTopic(this.intentosSubscribicionTopic, topic);
    }
  }

  // Método para suscribirse al topic 'estadoConexiones'
  private suscribirseAlTopicMensajeRecibido() {
    const topic = '/tema/actualizarListaMensajeRecibido/' + this.idUsuario;
    if (this.stompClient?.connected) {
      const subscription = this.stompClient.subscribe(topic, (respuesta: any) => {
        this.subscriptionMap.set(topic, subscription);
        this.intentosSubscribicionTopic = 0;
        this.sonidoService.mensaje();
        // Parsea el body a tipo esperado
        const mensajeRecibido: MensajeDTO = JSON.parse(respuesta.body);
        this.actualizarListaMensajeRecibido.next(mensajeRecibido);
      });
    } else {
      console.error(`No se puede suscribir al tópico ${topic}, WebSocket no está conectado`);
      this.reSuscribirseAlTopic(this.intentosSubscribicionTopic, topic);
    }
  }



  private reSuscribirseAlTopic(intentos: number, topic: string) {
    if (intentos < this.maxIntentosSubscribicionToken) {
      this.intentosSubscribicionTopic++;
      const delay = Math.min(3000 * Math.pow(2, intentos), 60000);
      setTimeout(() => {
        this.suscribirseAlTopic(topic);
      }, delay);
    } else {
      console.error(`Número máximo de intentos de suscripción alcanzado para el topic ${topic}`);
    }
  }

  private reconectarWebSocket(rolUsuario: string) {
    // Verificar si ya hay una reconexión en progreso
    if (this.stompClient?.connected || this.isReconnecting) {
      return;
    }

    this.isReconnecting = true;  // Marcar que está intentando reconectar

    setTimeout(() => {
      console.log('Intentando reconectar WebSocket...');
      this.iniciarConexionSocket(rolUsuario);
    }, 5000); // Intentar reconectar en 5 segundos
  }

  // Método para escuchar los mensajes después de que la conexión se haya establecido
  public getMessages(topic: string) {
    return this.messageSubjects[topic]?.asObservable();
  }

  // Obtener el estado de conexión
  public getConnectionState() {
    return this.connectionState.asObservable();
  }

  // ngOnDestroy() {
  //   this.desconectarYDesuscribir();
  // }

  public desconectarYDesuscribir() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Desconectado de WebSocket');
        this.connectionState.next(false); // Actualizar estado de conexión

        // Desuscribir de todos los topics y limpiar subjects
        this.subscriptionMap.forEach((subscription, topic) => {
          subscription.unsubscribe();
          console.log(`Desuscrito de ${topic}`);
        });

        Object.keys(this.messageSubjects).forEach(topic => {
          this.messageSubjects[topic].complete();
        });

        // Completar otros subjects
        this.estadoConexionesSubject.complete();
        this.actualizarListaMensajeRecibido.complete();
        this.actulizacionNotificacionEliminada.complete();
        this.actualizarMensajeLeidoAtrue.complete();
        this.mensajesGenerales.complete();

        // Limpiar estructuras
        this.subscriptionMap.clear();
        this.topics = [];
        this.messageSubjects = {};
      });
    } else {
      console.warn("El WebSocket ya estaba desconectado.");
    }
  }




  obtenerConexiones(): Observable<string[]> {
    return this.HttpClient.get<string[]>(this.baseUrl + "/socketConexiones/obtener");
  }

  public enviarMensajeChatGeneral(mensaje: MensajeGeneralRecord): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/chatGeneral',
        body: JSON.stringify(mensaje)
      });
    } else {
      console.error("Error: WebSocket no conectado.");
    }
  }

}

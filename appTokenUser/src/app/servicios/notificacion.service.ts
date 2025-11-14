import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilService } from './util.service';
import { Rutas } from '../enumerables/rutas';
import { EnumsDTOs } from '../enums/enums-dtos';
import { NotificacionDTO } from '../modelo/NotificacionDTO';
import { MensajeRetornoSimple } from '../modelo/mensaje-retorno-simple';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndpoint = "/notificacion"

  constructor(private http: HttpClient) { }

  getNotificacionesByUserId(idUser: number): Observable<NotificacionDTO[]> {
    return this.http.get<NotificacionDTO[]>(`${this.baseUrl + this.rutaEndpoint + "/byUserId"}/${idUser}`);
  }
  getNotificacionesNoLeidas(idUser: number): Observable<NotificacionDTO[]> {
    return this.http.get<NotificacionDTO[]>(this.baseUrl + this.rutaEndpoint + "/noLeidas/" + idUser);
  }

  visualizarNotificacionesByUserID(userId: number): Observable<string> {
    console.log(userId)
    const url = this.baseUrl + this.rutaEndpoint + "/visualizarNotificacionesByUserID/" + userId;
    return this.http.post<string>(url, null);
  }

  eliminarUsuarioAsignado(idNotificacion: number, idUsuario: number): Observable<string> {
    const url = `${this.baseUrl}/${idNotificacion}/${idUsuario}`;
    return this.http.put<string>(url, {});
  }

  getNotificaciones(): Observable<NotificacionDTO[]> {
    return this.http.get<NotificacionDTO[]>(this.baseUrl + this.rutaEndpoint);
  }

  getNotificacionById(id: number): Observable<NotificacionDTO> {
    return this.http.get<NotificacionDTO>(this.baseUrl + this.rutaEndpoint + "/" + id);
  }

  eliminarNotificacion(id: number): Observable<string> {
    return this.http.delete<string>(this.baseUrl + this.rutaEndpoint + "/" + id);
  }

  crearNotificacion(notificacion: NotificacionDTO): Observable<NotificacionDTO> {
    return this.http.post(this.baseUrl + this.rutaEndpoint, notificacion);
  }

  editNotificacion(notificacion: NotificacionDTO): Observable<NotificacionDTO> {
    return this.http.put(this.baseUrl + this.rutaEndpoint, notificacion);
  }

  notificarRespuestaRecibidaAcomentario(
    idPropietarioComentario: number,
    idComentario: number,
    idRespuesta: number
  ): Observable<MensajeRetornoSimple> {
    const ruta = `/notificarRespuestaRecibidaAcomentario/${idPropietarioComentario}/${idComentario}/${idRespuesta}`;
    return this.http.post<MensajeRetornoSimple>(this.baseUrl + this.rutaEndpoint + ruta, null);
  }

  notificarRespuestaRecibidaAUnaRespuesta(
    idPropietarioRespuesta: number,
    idRespuesta: number,
    idRespuestaRecibida: number
  ): Observable<MensajeRetornoSimple> {
    const ruta = `/notificarRespuestaRecibidaAUnaRespuesta/${idPropietarioRespuesta}/${idRespuesta}/${idRespuestaRecibida}`;
    return this.http.post<MensajeRetornoSimple>(this.baseUrl + this.rutaEndpoint + ruta, null);
  }


}
import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { HttpClient } from '@angular/common/http';
import { MensajeDTO } from '../modelo/mensaje-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndpoint = "/mensaje"

  constructor(private http: HttpClient) { }

  getMensaesEmisorReceptor(idEmisor:number, idReceptor:number): Observable<MensajeDTO[]> {
    return this.http.get<MensajeDTO[]>(this.baseUrl + this.rutaEndpoint + "/getMensaesEmisorReceptor/"+idEmisor+"/"+idReceptor);
  }

  getMensajes(): Observable<MensajeDTO[]> {
    return this.http.get<MensajeDTO[]>(this.baseUrl + this.rutaEndpoint);
  }

  getMensajeId(id: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(this.baseUrl + this.rutaEndpoint + "/" + id);
  }

  marcarMensajeLeido(mensajeId: number): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}${this.rutaEndpoint}/marcarMensajeLeido/${mensajeId}`, null);
  }
  
  editMensaje(mensaje: MensajeDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(this.baseUrl + this.rutaEndpoint, mensaje);
  }

  crearMensaje(mensaje: MensajeDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(this.baseUrl + this.rutaEndpoint + "/guardar", mensaje);
  }

  actualizarMensajeLeido(idMensajeReceptor:number) {
    return this.http.post(this.baseUrl + this.rutaEndpoint + "/actualizarMensajeLeido/" + idMensajeReceptor, null);
  }

  


}

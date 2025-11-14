import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeRetornoSimple } from '../modelo/mensaje-retorno-simple';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private rutaEndpoint = '/email';
  private rutaBase = Rutas.RUTA_BASE;

  constructor(private http: HttpClient) { }

  enviarEmail(emailDestinatario: string, asunto: string, mensaje: string): Observable<MensajeRetornoSimple> {
    const params = new HttpParams()
      .set('emailDestinatario', emailDestinatario)
      .set('asunto', asunto)
      .set('mensaje', mensaje);

    return this.http.post<MensajeRetornoSimple>(this.rutaBase + this.rutaEndpoint + "/enviar-emal-nueva-contrasenia", params);
  }
}


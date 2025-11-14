import { Injectable } from '@angular/core';
import { MensajeRetornoSimple } from '../modelo/mensaje-retorno-simple';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Rutas } from '../enumerables/rutas';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenVerificacionContraseniaService {

  constructor(private http: HttpClient) { }

  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndPoint = "/TokenRecuperacionContrasenia";

  public actualizarTokenVerificacion(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true'
    });
    return this.http.get<MensajeRetornoSimple>(this.baseUrl + this.rutaEndPoint + "/actualizarToken" + "/" + id, { headers });
  }

  public recuperarContrasenia(email: string): Observable<MensajeRetornoSimple> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true'
    });

    // Se construye la URL para la solicitud
    const url = `${this.baseUrl}${this.rutaEndPoint}/recuperarContraseña/${email}`;

    // Enviar la solicitud POST con el email como parámetro
    return this.http.post<MensajeRetornoSimple>(url, {}, { headers });
  }
}

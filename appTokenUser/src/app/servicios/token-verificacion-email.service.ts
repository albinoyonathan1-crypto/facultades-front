import { Injectable } from '@angular/core';
import { TokenVerificacionEmailDTO } from '../modelo/token-verificacion-email-dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rutas } from '../enumerables/rutas';
import { EnumsDTOs } from '../enums/enums-dtos';
import { MensajeRetornoSimple } from '../modelo/mensaje-retorno-simple';

@Injectable({
  providedIn: 'root'
})
export class TokenVerificacionEmailService {


  constructor(private http: HttpClient) { }

  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndPoint = "/tokenVerificacionEmail";

  // Obtener todos los tokens
  public getAllTokens(): Observable<TokenVerificacionEmailDTO[]> {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Skip-Interceptor': 'true'
    // });
    return this.http.get<TokenVerificacionEmailDTO[]>(this.baseUrl + this.rutaEndPoint);
  }

  // Obtener token por ID
  public getTokenById(id: number): Observable<TokenVerificacionEmailDTO> {
    return this.http.get<TokenVerificacionEmailDTO>(this.baseUrl + this.rutaEndPoint + "/" + id);
  }

  // Crear un nuevo token
  public crearToken(tokenDTO: TokenVerificacionEmailDTO): Observable<TokenVerificacionEmailDTO> {

    return this.http.post<TokenVerificacionEmailDTO>(this.baseUrl + this.rutaEndPoint, tokenDTO);
  }

  // Actualizar un token existente
  public actualizarToken(tokenDTO: TokenVerificacionEmailDTO): Observable<TokenVerificacionEmailDTO> {
    return this.http.put<TokenVerificacionEmailDTO>(this.baseUrl + this.rutaEndPoint, tokenDTO);
  }

  // Eliminar un token por ID
  public eliminarToken(id: number): Observable<string> {
    return this.http.delete<string>(this.baseUrl + this.rutaEndPoint + "/" + id);
  }

  public actualizarTokenVerificacion(id:number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true'
    });
    return this.http.get<MensajeRetornoSimple>(this.baseUrl + this.rutaEndPoint + "/actualizarToken"+ "/"+ id, {headers});
  }
}

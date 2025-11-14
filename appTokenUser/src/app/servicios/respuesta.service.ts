import { Injectable, OnInit } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, Observable } from 'rxjs';
import { UsuarioService } from './usuario.service';
import { EnumsDTOs } from '../enums/enums-dtos';
import { RespuestaDTO } from '../modelo/RespuestaDTO';
import { ComentarioDTO } from '../modelo/ComentarioDTO';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService implements OnInit {
  idUsuarioActual: number | undefined;

  constructor(private http: HttpClient, private userService: UsuarioService) { }

  ngOnInit(): void {
    this.userService.idUsuarioActual.subscribe(idUsuario => {
      if (idUsuario !== null)
        this.idUsuarioActual = idUsuario;
    });
  }

  private rutaEndpoint = '/respuesta';
  private rutaBase = Rutas.RUTA_BASE;

  public guardarRespuesta(respuesta: RespuestaDTO, idUsuario: number): Observable<RespuestaDTO> {
    // console.log(respuesta)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<RespuestaDTO>(this.rutaBase + this.rutaEndpoint, respuesta, { headers: headers });
  }

  crearRespuesta(mensaje: string): Observable<RespuestaDTO> {
    let respuesta: RespuestaDTO = {
      mensaje: mensaje,
    }
    return this.guardarRespuesta(respuesta, this.idUsuarioActual!);
  }


  actualizarRespuesta(respuestaOriginal: RespuestaDTO): Observable<any> {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json'
    // });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(this.rutaBase + this.rutaEndpoint, respuestaOriginal);
  }

  findRespuestaById(id: number): Observable<RespuestaDTO> {
    return this.http.get<RespuestaDTO>(this.rutaBase + this.rutaEndpoint + "/" + id);
  }

  findComentariosByListaRespuestaId(idRespuesta: number): Observable<ComentarioDTO> {
    return this.http.get<ComentarioDTO>(`${this.rutaBase}${this.rutaEndpoint}/findComentariosByListaRespuestaId/${idRespuesta}`);
  }

  eliminarRespuesta(id: number): Observable<string> {
    return this.http.delete<string>(this.rutaBase + this.rutaEndpoint + "/" + id);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { UsuarioLeidoDTO } from '../modelo/UsuarioLeidoDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioLeidoServiceService {

  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndPoint = "/usuarioLeido"; 
  constructor(private httpClient: HttpClient) {}

  // Método para obtener todos los usuarios leídos
  public getUsuariosLeidos(): Observable<UsuarioLeidoDTO[]> {
    return this.httpClient.get<UsuarioLeidoDTO[]>(this.baseUrl + this.rutaEndPoint);
  }

  // Método para obtener un usuario leído por ID
  public getUsuarioLeidoById(id: number): Observable<UsuarioLeidoDTO> {
    return this.httpClient.get<UsuarioLeidoDTO>(`${this.baseUrl}${this.rutaEndPoint}/${id}`);
  }

  // Método para crear un nuevo usuario leído
  public crearUsuarioLeido(usuarioLeido: UsuarioLeidoDTO): Observable<UsuarioLeidoDTO> {
    return this.httpClient.post<UsuarioLeidoDTO>(this.baseUrl + this.rutaEndPoint, usuarioLeido);
  }

  // Método para editar un usuario leído
  public editUsuarioLeido(usuarioLeido: UsuarioLeidoDTO): Observable<UsuarioLeidoDTO> {
    return this.httpClient.put<UsuarioLeidoDTO>(this.baseUrl + this.rutaEndPoint, usuarioLeido);
  }

}

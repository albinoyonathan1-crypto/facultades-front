import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from './socket.service';
import { UsuarioService } from './usuario.service';
import { Rutas } from '../enumerables/rutas';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebSocketConexionesService {

  // constructor(private HttpClient:HttpClient, private router: Router, private socket: SocketService, private usuarioService: UsuarioService) { }
  // private baseUrl = Rutas.RUTA_BASE;

  // obtenerConexiones(): Observable<string[]> {
  //   return this.HttpClient.get<string[]>(this.baseUrl+"/socketConexiones");
  // }
}

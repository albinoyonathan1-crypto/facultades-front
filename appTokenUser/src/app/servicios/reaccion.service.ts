import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { Observable } from 'rxjs';
import { EnumsDTOs } from '../enums/enums-dtos';
import { ReaccionDTO } from '../modelo/ReaccionDTO';

@Injectable({
  providedIn: 'root'
})
export class ReaccionService {

  constructor(private http: HttpClient) { }
  private rutaBase = Rutas.RUTA_BASE;
  private rutaEndPoint = "/reaccion"

  getReacciones(): Observable<ReaccionDTO[]> {
    return this.http.get<ReaccionDTO[]>(this.rutaBase + this.rutaEndPoint);
  }

  getReaccionById(id: number): Observable<ReaccionDTO> {
    return this.http.get<ReaccionDTO>(this.rutaBase + this.rutaEndPoint + "/" + id);
  }

  crearReaccion(reaccion: ReaccionDTO): Observable<ReaccionDTO> {
    return this.http.post(this.rutaBase + this.rutaEndPoint, reaccion);
  }

  editarReaccion(reaccion: ReaccionDTO): Observable<ReaccionDTO> {
    return this.http.put(this.rutaBase + this.rutaEndPoint, reaccion);
  }

  public guardarReaccion(reaccion: ReaccionDTO): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.rutaBase + this.rutaEndPoint, reaccion, { headers: headers });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { Observable } from 'rxjs';
import { EnumsDTOs } from '../enums/enums-dtos';
import { CalificacionDTO } from '../modelo/calificacion';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  constructor(private http:HttpClient) { }
  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndPoint = "/calificacion";

  getCalificaciones():Observable<CalificacionDTO[]>{
    return this.http.get<CalificacionDTO[]>(this.baseUrl + this.rutaEndPoint);
  }

  getCalificacionById(id:number):Observable<CalificacionDTO>{
    return this.http.get<CalificacionDTO>(this.baseUrl + this.rutaEndPoint + "/" + id);
  }
  
  crearCalificacion(calificacion:CalificacionDTO):Observable<CalificacionDTO>{
    return this.http.post<CalificacionDTO>(this.baseUrl + this.rutaEndPoint, calificacion);
  }
  
  editCalificacion(calificacion:CalificacionDTO):Observable<CalificacionDTO>{
    return this.http.put<CalificacionDTO>(this.baseUrl + this.rutaEndPoint, calificacion);
  }
  

}

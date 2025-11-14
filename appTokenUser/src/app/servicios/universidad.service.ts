import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rutas } from '../enumerables/rutas';
import { map, Observable } from 'rxjs';

import { EnumsDTOs } from '../enums/enums-dtos';
import { UniversidadDTO } from '../modelo/UniversidadDTO';

@Injectable({
  providedIn: 'root'
})
export class UniversidadService {
  constructor(private http: HttpClient) { }

  private baseUrl = Rutas.RUTA_BASE;
  private rutaEndPoint = "/universidad"

  public getUniversidades(): Observable<UniversidadDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<UniversidadDTO[]>(this.baseUrl + this.rutaEndPoint, { headers }).pipe(
      map(universidades => universidades.filter(universidad => universidad.eliminacionLogica === false))
    );
  }

  public getUniversidadById(id: number): Observable<UniversidadDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    })
    return this.http.get<UniversidadDTO>(this.baseUrl + this.rutaEndPoint + "/" + id, { headers });
  }

  public crearUniversidad(universidad: UniversidadDTO): Observable<UniversidadDTO> {
    return this.http.post(this.baseUrl + this.rutaEndPoint, universidad);
  }

  public editUniversidad(universidad: UniversidadDTO): Observable<UniversidadDTO> {
    return this.http.put(this.baseUrl + this.rutaEndPoint, universidad);
  }

  public obtenerTopUniversidades(pagina: number, tamanio: number): Observable<UniversidadDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    })
    return this.http.get<UniversidadDTO[]>(`${this.baseUrl}${this.rutaEndPoint}/obtenerTopUniversidades?pagina=${pagina}&tamanio=${tamanio}`, { headers })
  }


  getuniversidadIdCarrera(idCarrera: number): Observable<UniversidadDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<UniversidadDTO>(this.baseUrl + this.rutaEndPoint + "/universidadID/" + idCarrera, { headers });
  }

  obtenerUniversidadesPaginadas(pagina: number, tamanio: number): Observable<UniversidadDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<UniversidadDTO[]>(`${this.baseUrl}${this.rutaEndPoint}/paginadas?pagina=${pagina}&tamanio=${tamanio}`, { headers })
  }

  public buscarUniversidadesPorNombre(name: string): Observable<UniversidadDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<UniversidadDTO[]>(this.baseUrl + this.rutaEndPoint + "/findUniversidadByName/" + name, { headers }).pipe(
      map(universidades => universidades.filter(universidad => universidad.eliminacionLogica === false)));
  }

  public getAllComents(idUniversidad: number): Observable<Number> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<Number>(this.baseUrl + this.rutaEndPoint + "/getAllComents/" + idUniversidad, { headers });
  }

  public eliminarUniversidad(id: number): Observable<string> {
    return new Observable<string>(observer => {
      this.getUniversidadById(id).subscribe(universidadBuscada => {
        universidadBuscada.eliminacionLogica = true;
        this.editUniversidad(universidadBuscada).subscribe(() => {
          observer.next('Universidad eliminada lógicamente');
          observer.complete();
        });
      });
    });
  }


  public buscarUniversidadesActivas(): Observable<number[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Skip-Interceptor': 'true' // Encabezado personalizado
    });
    return this.http.get<number[]>(this.baseUrl + this.rutaEndPoint + "/buscarUniversidadesActivas", { headers });
  }
}

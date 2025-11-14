import { Component } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { CalificacionDTO } from 'src/app/modelo/calificacion';

import { CalificacionService } from 'src/app/servicios/calificacion.service';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent {

  constructor(private calificacionService: CalificacionService) { }
  mensajeError!: string;

  public getCalificaciones() {
    this.calificacionService.getCalificaciones()
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (calificaciones) => {
          console.log(calificaciones);
        }
      })
  }

  public getCalificacionById(id: number) {
    this.calificacionService.getCalificacionById(id)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (calificacion) => {
          console.log(calificacion);
        }
      })
  }

  public crearCalificacion(nota: number) {
    const calificacion: CalificacionDTO = {
      nota: nota
    }
    this.calificacionService.crearCalificacion(calificacion)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (calificacion) => {
          console.log(calificacion);
        }
      })
  }

  
  public editCalificacion(id:number,nota: number) {
    const calificacion: CalificacionDTO = {
      id:id,
      nota: nota
    }
    this.calificacionService.editCalificacion(calificacion)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (calificacion) => {
          console.log(calificacion);
        }
      })
  }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalificacionDTO } from 'src/app/modelo/calificacion';

import { CalificacionService } from 'src/app/servicios/calificacion.service';

@Component({
  selector: 'app-puntuacion',
  templateUrl: './puntuacion.component.html',
  styleUrls: ['./puntuacion.component.css']
})
export class PuntuacionComponent {

  puntuacion: number = 0.0;

  constructor(private calificacionService: CalificacionService) { }

  @Output() calificacionGuardada: EventEmitter<CalificacionDTO> = new EventEmitter<CalificacionDTO>();
  @Input() esEditable: boolean = false;
  @Input() idCalificacion: number = 0;
  @Input() idUsuario: number = 0;

  capturarPuntacion(event: Event) {
    let puntos: string = (<HTMLInputElement>event.target).value;
    this.puntuacion = parseFloat(puntos);

    let calificacion: CalificacionDTO = {
      usuarioId: Number(localStorage.getItem('userID')),
      nota: this.puntuacion
    }

    if (!this.esEditable) {
      this.calificacionService.crearCalificacion(calificacion).subscribe((calificacion) => {
        this.calificacionGuardada.emit(calificacion);
      });
    } else {
      const calificacion: CalificacionDTO = {
        id: this.idCalificacion,
        nota: this.puntuacion,
        usuarioId: this.idUsuario
      }
      this.calificacionService.editCalificacion(calificacion).subscribe(
        () => {
          const calificacionNula: CalificacionDTO = {
            id: undefined,
            nota: undefined,
            usuarioId: undefined
          };
          this.calificacionGuardada.emit(calificacionNula);
        }
      );
    }
  }

}

import { Component } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { ReaccionDTO } from 'src/app/modelo/ReaccionDTO';
import { ReaccionService } from 'src/app/servicios/reaccion.service';

@Component({
  selector: 'app-reaccion',
  templateUrl: './reaccion.component.html',
  styleUrls: ['./reaccion.component.css']
})
export class ReaccionComponent {

  constructor(private reaccionService: ReaccionService) { }
  mensajeError!: string;

  getReacciones() {
    this.reaccionService.getReacciones()
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (reacciones) => {
          console.log(reacciones);
        }
      })
  }

  getReaccionesById(id: number) {
    this.reaccionService.getReaccionById(id)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (reaccion) => {
          console.log(reaccion);
        }
      })
  }

  crearReaccion(meGusta: number, noMegusta: number) {
    console.log(noMegusta)
    const reaccion: ReaccionDTO = {
      meGusta: meGusta,
      noMegusta: noMegusta
    }
    this.reaccionService.crearReaccion(reaccion)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (reaccion) => {
          console.log(reaccion);
        }
      })
  }

  editReaccion(id:number, meGusta: number, noMegusta: number) {
    const reaccion: ReaccionDTO = {
      id:id,
      meGusta: meGusta,
      noMegusta: noMegusta
    }
    this.reaccionService.editarReaccion(reaccion)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (reaccion) => {
          console.log(reaccion);
        }
      })
  }
}

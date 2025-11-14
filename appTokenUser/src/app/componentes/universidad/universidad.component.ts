import { Component } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';

import { UniversidadService } from 'src/app/servicios/universidad.service';

@Component({
  selector: 'app-universidad',
  templateUrl: './universidad.component.html',
  styleUrls: ['./universidad.component.css']
})
export class UniversidadComponent {
mensajeError!: string;

  constructor(private universidadService: UniversidadService) { }

  getUniversidades() {
    this.universidadService.getUniversidades()
      .pipe(catchError((error: string) => {
        this.mensajeError=error;
        return EMPTY;
      })).subscribe({
        next: (universidades) => {
          console.log(universidades);
        }
      })
  }

  crearUniversidad(
    nombre: string, 
    imagen?: string, 
    direccion?: string, 
    descripcion?: string, 
    direccionWeb?: string, 
  ) {
    const universidad: UniversidadDTO = {
      nombre: nombre,
      imagen: imagen || '',
      direccion: direccion || '',
      descripcion: descripcion || '',
      direccionWeb: direccionWeb || '',
    };
  
    this.universidadService.crearUniversidad(universidad)
    .pipe(catchError((error:string) => {
      this.mensajeError = error;
      return EMPTY;
    })).subscribe({
      next:(universidad) => {
        console.log(universidad);
      }
    })
  }

  getUniversidadById(id:number){
    this.universidadService.getUniversidadById(id)
    .pipe(catchError((error:string) => {
      this.mensajeError = error;
      return EMPTY;
    })).subscribe({
      next: (universidad) => {
        console.log(universidad);
      }
    })
  }

  editarUniversidad(
    id:number,
    nombre?: string, 
    imagen?: string, 
    direccion?: string, 
    descripcion?: string, 
    direccionWeb?: string, 
  ) {
    const universidad: UniversidadDTO = {
      id:id,
      nombre: nombre,
      imagen: imagen || '',
      direccion: direccion || '',
      descripcion: descripcion || '',
      direccionWeb: direccionWeb || '',
    };
  
    this.universidadService.editUniversidad(universidad)
    .pipe(catchError((error:string) => {
      this.mensajeError = error;
      return EMPTY;
    })).subscribe({
      next:(universidad) => {
        console.log(universidad);
      }
    })
  }

}

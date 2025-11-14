import { Component } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { PermisoDTO } from 'src/app/modelo/PermisoDTO';
import { PermisoService } from 'src/app/servicios/permiso.service';

@Component({
  selector: 'app-permiso',
  templateUrl: './permiso.component.html',
  styleUrls: ['./permiso.component.css'],
})
export class PermisoComponent {
  constructor(private permisoService: PermisoService) { }

  mensajeError!: string;

  getPermisos() {
    this.permisoService
      .getPermisos()
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error;
          return EMPTY;
        })
      )
      .subscribe({
        next: (permisos) => {
          console.log(permisos);
        },
      });
  }

  getPermisoById(id: number) {
    this.permisoService
      .getPermisoById(id)
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error;
          return EMPTY;
        })
      )
      .subscribe({
        next: (permiso) => {
          console.log(permiso);
        },
      });
  }

  crearPermiso(nombrePermiso: string) {
    const permiso: PermisoDTO = {
      nombrePermiso: nombrePermiso,
    };
    this.permisoService
      .crearPermiso(permiso)
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error;
          return EMPTY;
        })
      )
      .subscribe({
        next: (permiso) => {
          console.log(permiso);
        },
      });
  }

  editPermiso(id: number, nombrePermiso: string) {
    const permiso: PermisoDTO = {
      id: id,
      nombrePermiso: nombrePermiso,
    };
    this.permisoService
      .editPermiso(permiso)
      .pipe(
        catchError((error: string) => {
          this.mensajeError = error;
          return EMPTY;
        })
      )
      .subscribe({
        next: (permiso) => {
          console.log(permiso);
        },
      });
  }
}

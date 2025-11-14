import { Component, EventEmitter, Output } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';

import { UniversidadService } from 'src/app/servicios/universidad.service';

@Component({
  selector: 'app-barra-busqueda',
  templateUrl: './barra-busqueda.component.html',
  styleUrls: ['./barra-busqueda.component.css']
})
export class BarraBusquedaComponent {

  constructor(private universidadService: UniversidadService) { }
  mensajeError!: string;
  nombreUniversidad!: string;

  @Output() universdiadEncontrada: EventEmitter<UniversidadDTO[]> = new EventEmitter<UniversidadDTO[]>();

  buscarUniversidadPorNombre(nombreUniversdiad: string) {
    this.universidadService.buscarUniversidadesPorNombre(nombreUniversdiad)
      .subscribe((universidades) => {
        this.universdiadEncontrada.emit(universidades);
      })
  }
  
}

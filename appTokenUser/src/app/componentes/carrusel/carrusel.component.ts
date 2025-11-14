import { Component } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';

import { UniversidadService } from 'src/app/servicios/universidad.service';

@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css']
})
export class CarruselComponent {
  constructor(private universidadService: UniversidadService) { }

  universidades: UniversidadDTO[] = new Array(3);
  mensajeError!: string;

  ngOnInit(): void {
    this.cargarTresPrimerasImagenes();
  }

  cargarTresPrimerasImagenes() {

    this.universidadService.obtenerTopUniversidades(0, 3)
      .pipe(catchError((error: string) => {
        this.mensajeError = error;
        return EMPTY;
      })).subscribe({
        next: (universidades) => {
          this.universidades = universidades;
          if (universidades.length < 3) {
            this.completarCampos(this.universidades);
          }
        }
      })
  }

  completarCampos(listaUniversdiades: UniversidadDTO[]) {
    for (let i = listaUniversdiades.length; i < 3; i++) {

      if (!listaUniversdiades[i]) {
        const nuevaUniversidad: UniversidadDTO = {
          nombre: "Nombre no disponible",  // O algún valor predeterminado
          descripcion: "Descripción no disponible",  // O algún valor predeterminado
          imagen: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"
          // Puedes agregar otras propiedades necesarias con valores predeterminados
        };
        listaUniversdiades[i] = nuevaUniversidad;
      }
      //listaUniversdiades[i].imagen = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";
    }
  }


  imagenNocargada(event: Event) {
    const imgElemnt = event.target as HTMLImageElement;
    imgElemnt.src = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";
  }
}

import { Component, OnInit } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';
import { UniversidadService } from 'src/app/servicios/universidad.service';

@Component({
  selector: 'app-top-universidad',
  templateUrl: './top-universidad.component.html',
  styleUrls: ['./top-universidad.component.css']
})
export class TopUniversidadComponent implements OnInit {

  listaTopUniversidades: UniversidadDTO[] = []; // Lista de universidades
  pagina: number = 0; // Página actual para la paginación
  registrosPorPagina: number = 5; // Número de registros por página
  totalUniversidades: number = 0; // Total de universidades
  mensajeError: string | null = null; // Mensaje de error en caso de fallo

  constructor(private universidadService: UniversidadService) { }

  ngOnInit(): void {
    this.cargarUniversidades(); // Cargar las universidades al iniciar el componente
  }

  // Método para cargar las universidades basadas en la página actual
  cargarUniversidades(): void {
    this.universidadService.obtenerTopUniversidades(this.pagina, this.registrosPorPagina)
      .subscribe((universidades: UniversidadDTO[]) => {
        this.listaTopUniversidades = universidades;
        this.totalUniversidades = universidades.length;
      });
  }

  // Cargar más universidades (incrementar la página actual)
  cargarMasUniversidades(): void {
    this.pagina++;
    this.cargarUniversidades();
  }

  // Cargar menos universidades (decrementar la página actual)
  cargarMenosUniversidades(): void {
    if (this.pagina > 0) {
      this.pagina--;
      this.cargarUniversidades();
    }
  }
}

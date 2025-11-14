import { Component, OnInit } from '@angular/core';
import { CarreraDTO } from 'src/app/modelo/CarreraDTO';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';

import { CarreraService } from 'src/app/servicios/carrera.service';
import { UniversidadService } from 'src/app/servicios/universidad.service';

@Component({
  selector: 'app-top-carrera',
  templateUrl: './top-carrera.component.html',
  styleUrls: ['./top-carrera.component.css']
})
export class TopCarreraComponent implements OnInit {

  listaTopCarreras: CarreraDTO[] = []; // Almacena la lista de carreras
  universidad: UniversidadDTO | null = null; // Universidad seleccionada
  indiceCarreraSeleccionada: number | null = null; // Índice de la carrera seleccionada
  paginaActual: number = 0; // Página actual para la paginación
  registrosPorPagina: number = 5; // Registros por página
  totalCarrerasCargadas: number = 0; // Carreras cargadas
  universidadesActivas:number[] = [];

  constructor(
    private carreraService: CarreraService,
    private universidadService: UniversidadService
  ) { }

  ngOnInit(): void {
    this.cargarCarreras();
    this.obtenerUniversidadesActivas();
  }

  cargarCarreras(): void {
    this.carreraService.obtenerTopCarreras(this.paginaActual, this.registrosPorPagina)
      .subscribe((carreras: CarreraDTO[]) => {
        this.listaTopCarreras = carreras;
      })
  }

  cargarMasCarreras(cantidadCarreras: number): void {
    this.paginaActual++;
    this.totalCarrerasCargadas += cantidadCarreras;
    this.cargarCarreras();
  }

  cargarMenosCarreras(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.totalCarrerasCargadas -= this.registrosPorPagina;
      this.cargarCarreras();
    }
  }

  buscarUniversidadPorIdCarrera(carrera: CarreraDTO, indice: number): void {
    this.indiceCarreraSeleccionada = indice;

    this.universidadService.getuniversidadIdCarrera(carrera.id!)
      .subscribe(
        (universidad: UniversidadDTO) => {
          this.universidad = universidad;
        },
        (error) => {
          console.error('Error al buscar la universidad:', error);
        }
      );
  }


  obtenerUniversidadesActivas(): void {
    this.universidadService.buscarUniversidadesActivas().subscribe({
      next: (ids: number[]) => {
        console.log("Universidades activas:", ids);
        //this.universidadesActivas = ids;
      },
      error: (error) => {
        console.error("Error al obtener universidades activas:", error);
      }
    });
  }
}

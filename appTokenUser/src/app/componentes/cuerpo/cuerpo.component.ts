import { Component, OnInit } from '@angular/core';
import { UniversidadService } from 'src/app/servicios/universidad.service';
import { UtilService } from 'src/app/servicios/util.service';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';

@Component({
  selector: 'app-cuerpo',
  templateUrl: './cuerpo.component.html',
  styleUrls: ['./cuerpo.component.css']
})
export class CuerpoComponent implements OnInit {
  universidades: UniversidadDTO[] = [];
  registrosPorPagina = 6;
  paginaActual = 0;
  cantidadPaginas = 0;
  universidadNoEncontrada = false;
  mensajeError!: string;
  idsPropietariosUniversidades: number[] = [];
  idUsuarioActual = Number(localStorage.getItem("userID"));

  constructor(
    private universidadService: UniversidadService,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.inicializarUniversidades();
    // this.obtenerIdsPropietariiosUniversidades();
  }

  private inicializarUniversidades() {
    this.universidadService.getUniversidades().subscribe({
      next: data => {
        this.cantidadPaginas = Math.ceil(data.length / this.registrosPorPagina);
        this.cargarUniversidadesPorPagina();
      },
      error: (error) => this.manejarError(error)
    });
  }

  private cargarUniversidadesPorPagina() {
    this.universidadService.obtenerUniversidadesPaginadas(this.paginaActual, this.registrosPorPagina)
      .subscribe({
        next: universidades => {
          console.log("hola pepe" + universidades.length)
          this.universidades = universidades;

        },
        error: (error) => this.manejarError(error)
      });
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 0 && nuevaPagina < this.cantidadPaginas) {
      this.paginaActual = nuevaPagina;
      this.cargarUniversidadesPorPagina();
    }
  }

  manejarUniversidadesEncontradas(universidades: UniversidadDTO[]) {
    if (universidades.length > 0) {
      this.universidades = universidades;
      this.universidadNoEncontrada = false;
    } else {
      this.mostrarMensajeUniversidadNoEncontrada();
      this.cargarUniversidadesPorPagina();
    }
  }

  private mostrarMensajeUniversidadNoEncontrada() {
    this.universidadNoEncontrada = true;
    setTimeout(() => {
      this.universidadNoEncontrada = false;
    }, 3000);
  }

  recargarUniversidades() {
    this.cargarUniversidadesPorPagina();
  }

  manejarImagenNoCargada(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";
  }

  private manejarError(error: any) {
    console.error("Ocurrió un error al cargar los datos:", error);
    this.mensajeError = "No se pudieron cargar los datos. Por favor, intente de nuevo.";
  }

  // private obtenerIdsPropietariiosUniversidades() {
  //   this.universidadService.getUniversidades().subscribe(
  //     (universidadesEncontradas: UniversidadDTO[]) => {
  //       universidadesEncontradas?.forEach(universidad => {
  //         this.idsPropietariosUniversidades?.push(universidad.usuarioId!);
  //       });
  //     }
  //   )
  // }

  // public propietarioUniversidad(): boolean {
  //   const idUsuarioActual = Number(localStorage.getItem("userID"));
  //   this.idsPropietariosUniversidades?.forEach(id => {
  //     if (idUsuarioActual == id)
  //       return true;
  //   })
  //   return false;
  // }
}

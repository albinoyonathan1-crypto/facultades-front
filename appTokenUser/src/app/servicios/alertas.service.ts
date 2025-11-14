import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { CarreraDTO } from '../modelo/CarreraDTO';
import { CarreraService } from './carrera.service';
import { UniversidadService } from './universidad.service';
import { UniversidadDTO } from '../modelo/UniversidadDTO';
import { Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { SonidoService } from './sonido-service.service';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor(private carreraService: CarreraService, private univiersidadService: UniversidadService, private router: Router, private sonidoService:SonidoService) { }

  mostrarAlerta(titulo: string) {
    Swal.fire({
      title: titulo,
      icon: "success",
      draggable: true
    });
  }


  async modalAgregarCarrera(iduniversidad: number, idUsuarioLogueado:number): Promise<Observable<UniversidadDTO>> {
    const { value: carrera } = await Swal.fire({
      title: "Agregar carrera",
      html: this.getCarreraFormHtml(),
      focusConfirm: false,
      preConfirm: () => this.createCarreraDTO(iduniversidad, idUsuarioLogueado),
    });

    if (!carrera) {
      return new Observable<UniversidadDTO>();  // Retornar observable vacío si no se agregó la carrera
    }

    return this.carreraService.crearCarrera(carrera).pipe(
      switchMap(carreraGuardada => {
        return this.univiersidadService.getUniversidadById(iduniversidad).pipe(
          switchMap(universidad => {
            // Aquí se define y usa correctamente 'carreraGuardada'
            universidad.listaCarreras?.push(carreraGuardada);
            return this.univiersidadService.editUniversidad(universidad);
          })
        );
      })
    );
  }

  private getCarreraFormHtml(): string {
    return `
      <style>
        .swal2-input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          box-sizing: border-box;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
        }
      </style>
      <label for="swal-input1">Nombre de la carrera:</label>
      <input id="swal-input1" class="swal2-input" placeholder="Ejemplo: Ingeniería en Sistemas">
      <label for="swal-input2">Grado de la carrera:</label>
      <input id="swal-input2" class="swal2-input" placeholder="Ejemplo: Superior">
      <label for="swal-input3">Duración de la carrera:</label>
      <input id="swal-input3" class="swal2-input" placeholder="Ejemplo: 5 años">
    `;
  }

  private createCarreraDTO(iduniversidad: number, idUsuarioLogueado:number): CarreraDTO | null {
    const nombre = (document.getElementById("swal-input1") as HTMLInputElement).value;
    const grado = (document.getElementById("swal-input2") as HTMLInputElement).value;
    const duracion = (document.getElementById("swal-input3") as HTMLInputElement).value;

    // Validación: Si alguno de los campos está vacío, mostrar un mensaje de error
    if (!nombre || !grado || !duracion) {
      Swal.showValidationMessage('Todos los campos son obligatorios');
      return null; // Retorna null para evitar la creación de la carrera
    }

    return {
      nombre,
      grado,
      duracion,
      activa: true,
      universidadId: iduniversidad,
      idUsuario:idUsuarioLogueado
    };
  }

  public exito(titulo: string) {
    Swal.fire({
      title: titulo,
      icon: "success",
      draggable: true
    });
  }

  public ventanaEmergente(titulo: string) {
    Swal.fire({
      title: titulo,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    });
  }

  public mostrarDialogoDeConfirmacion(callback: () => void): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Ejecutar el callback
        callback();
        // Mostrar confirmación
        Swal.fire({
          title: "¡Eliminado!",
          text: "Tu archivo ha sido eliminado.",
          icon: "success",
        });
      }
    });
  }

  public mostrarDialogoDeConfirmacionParametros(texto: string, callback: () => void): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: texto,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, continuar!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Ejecutar el callback
        callback();
        // Mostrar confirmación
        Swal.fire({
          title: "Hecho!",
          text: "Tu archivo ha sido modificado.",
          icon: "success",
        });
      }
    });
  }

  public error(mensaje: string) {
    Swal.fire({
      icon: "error",
      title: "Algo salio mal",
      text: mensaje,
      // footer: '<a href="#">Why do I have this issue?</a>'
    });
  }


topLateral(evento: string, informacion: string) {
  this.sonidoService.notificacion();
  const Toast = Swal.mixin({
    toast: true,
    position: "top-start",
    showConfirmButton: true, // Mostrar un botón para cerrar
    confirmButtonText: "Cerrar",
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  Toast.fire({
    icon: "success",
    title: evento,
    html: `
        <div style="max-height: 100px; overflow: hidden; max-width: 600px; text-overflow: ellipsis; white-space: nowrap;">
          ${informacion}
        </div>
        <br>
        <button id="redirectBtn" style="margin-top: 10px; padding: 5px 10px; background-color: #3085d6; color: white; border: none; cursor: pointer; border-radius: 5px;">
          Ver Notificaciones
        </button>
      `,
    didOpen: () => {
      document.getElementById("redirectBtn")?.addEventListener("click", () => {
        this.router.navigate(['/notificaciones']);
      });
    }
  });
}
  
  
  
}

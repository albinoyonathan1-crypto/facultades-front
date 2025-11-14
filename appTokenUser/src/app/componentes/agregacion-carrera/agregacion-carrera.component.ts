import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarreraDTO } from 'src/app/modelo/CarreraDTO';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { UniversidadService } from 'src/app/servicios/universidad.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregacion-carrera',
  templateUrl: './agregacion-carrera.component.html',
  styleUrls: ['./agregacion-carrera.component.css']
})
export class AgregacionCarreraComponent implements OnInit {

  idUniversidad: number = 0;
  universidadAeditar: UniversidadDTO | undefined;
  @Input() universidad?: UniversidadDTO; // Propiedad opcional proveniente del padre


  constructor(private route: ActivatedRoute, private universidadService: UniversidadService, private alertas: AlertasService) { }

  ngOnInit(): void {
    if (!this.universidad) {
      this.idUniversidad = this.route.snapshot.params["id"];
      this.buscarUniversidad();
    } else {
      this.universidadAeditar = this.universidad;
    }
  }

  buscarUniversidad() {
    this.universidadService.getUniversidadById(this.idUniversidad).subscribe(
      (universidad: UniversidadDTO) => {
        if (universidad.listaCarreras) {
          universidad.listaCarreras = universidad.listaCarreras.filter(carrera => !carrera.eliminacionLogica);
          this.universidadAeditar = universidad;
        }
      }
    );
  }


  async agregarCarrera() {
    let idUsuarioLogueado: number = Number(localStorage.getItem('userID'));
    (await this.alertas.modalAgregarCarrera(this.idUniversidad, idUsuarioLogueado)).subscribe(
      (universidadActualizada: UniversidadDTO) => {
        this.universidadAeditar = universidadActualizada;
        Swal.fire('Carrera agregada');
      },
      (error) => {
        console.error('Error al agregar carrera:', error);
      }
    );
  }


}

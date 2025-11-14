import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { CarreraService } from 'src/app/servicios/carrera.service';
import { UniversidadService } from 'src/app/servicios/universidad.service';

@Component({
  selector: 'app-edicion-universidad',
  templateUrl: './edicion-universidad.component.html',
  styleUrls: ['./edicion-universidad.component.css']
})
export class EdicionUniversidadComponent implements OnInit {
  idUniversidad: number = 0;
  universidadForm: FormGroup;
  universidadBuscada: UniversidadDTO | undefined;
  idCarreraEliminar: number = 0;
  eliminar: boolean = false;

  constructor(private route: ActivatedRoute, private universidadService: UniversidadService,
    private alertas: AlertasService, private fb: FormBuilder, private router: Router, private carreraService: CarreraService) {
    this.universidadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      descripcion: ['', [Validators.required, Validators.minLength(40)]],
      direccion: ["", [Validators.required, Validators.minLength(10)]],
      imagen: ['', Validators.required],
      direccionWeb: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  ngOnInit(): void {
    this.idUniversidad = this.route.snapshot.params["id"];
    this.buscarUniversidad();
  }

  buscarUniversidad() {
    this.universidadService.getUniversidadById(this.idUniversidad).subscribe(
      (universidadEncontrada: UniversidadDTO) => {
        universidadEncontrada.listaCarreras = universidadEncontrada.listaCarreras?.filter(carrera => !carrera.eliminacionLogica);
        this.universidadBuscada = universidadEncontrada;
        this.cargarDatosUniversidadBuscada(universidadEncontrada);
      }, (error) => {
        console.error(error);
      }
    )
  }

  cargarDatosUniversidadBuscada(universidadEncontrada: UniversidadDTO) {
    this.universidadForm.patchValue({
      nombre: universidadEncontrada.nombre,
      direccion: universidadEncontrada.direccion,
      descripcion: universidadEncontrada.descripcion,
      direccionWeb: universidadEncontrada.direccionWeb,
      imagen: universidadEncontrada.imagen
    });
  }


  onSubmit(): void {
    if (this.universidadForm.valid) {
      this.alertas.mostrarDialogoDeConfirmacionParametros("Estas por editar la universidad",() => {
        this.completarCamposAeditar();
        this.universidadService.editUniversidad(this.universidadBuscada!).subscribe(
          (universidadEditada: UniversidadDTO) => {
            this.router.navigate(["/"])
          });
      })
    } else {
      alert('Por favor, llena todos los campos correctamente');
    }
  }

  completarCamposAeditar() {
    if (this.universidadBuscada) {
      this.universidadBuscada.nombre = this.universidadForm.get('nombre')?.value || this.universidadBuscada.nombre;
      this.universidadBuscada.descripcion = this.universidadForm.get('descripcion')?.value || this.universidadBuscada.descripcion;
      this.universidadBuscada.imagen = this.universidadForm.get('imagen')?.value || this.universidadBuscada.imagen;
      this.universidadBuscada.direccion = this.universidadForm.get('direccion')?.value || this.universidadBuscada.direccion;
      this.universidadBuscada.direccionWeb = this.universidadForm.get('direccionWeb')?.value || this.universidadBuscada.direccionWeb;
    }
  }

  eliminarUniversidad() {
    this.alertas.mostrarDialogoDeConfirmacion(() => {
      this.universidadService.eliminarUniversidad(this.idUniversidad).subscribe(
        () => {
          this.router.navigate(['/']);
        }, (error) => {
          console.error(error);
        }
      )
    })
  }

  onCarreraChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      console.log('ID de la carrera seleccionada:', target.value);
      this.idCarreraEliminar = Number(target.value);
      // Realiza acciones con el ID seleccionado
    } else {
      console.error('El target es null');
    }
  }

  eliminarCarrera() {
    this.alertas.mostrarDialogoDeConfirmacion(() => {
      this.carreraService.eliminarCarrera(this.idCarreraEliminar).subscribe(
        () => {
          console.log("carrera eliminada");
          window.location.reload();
        }, (error) => {
          console.error(error)
        }
      )
    })
  }

  habilitarEliminacion() {
    this.eliminar = !this.eliminar;
  }

}

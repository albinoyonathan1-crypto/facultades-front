import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalificacionDTO } from 'src/app/modelo/calificacion';
import { CarreraDTO } from 'src/app/modelo/CarreraDTO';
import { UniversidadDTO } from 'src/app/modelo/UniversidadDTO';
import { UsuarioDTO } from 'src/app/modelo/UsuarioDTO';
import { UsuarioLeidoDTO } from 'src/app/modelo/UsuarioLeidoDTO';
import { AlertasService } from 'src/app/servicios/alertas.service';

import { CarreraService } from 'src/app/servicios/carrera.service';
import { UniversidadService } from 'src/app/servicios/universidad.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
// import { AlertasService } from 'src/app/servicios/alertas.service';

@Component({
  selector: 'app-agregar-universidad',
  templateUrl: './agregar-universidad.component.html',
  styleUrls: ['./agregar-universidad.component.css'],
})
export class AgregarUniversidadComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private carreraService: CarreraService,
    private universidadService: UniversidadService,
    private usuarioService: UsuarioService,
    private alertasService: AlertasService
  ) {}

  ngOnInit(): void {
    //if (localStorage.getItem('userRole') == null) this.router.navigate(['']);
    this.formularioAltaUniversidad = this.iniciarFormAltaUniversidad();
  }

  formularioAltaUniversidad!: FormGroup;

  indice: number = 1;
  visualizarCamposCarrera: boolean = false;
  imagenCargada: boolean = false;
  listaCarrerasUniversidad: CarreraDTO[] = [];
  listaCalificacionUniversidad: CalificacionDTO[] = [];
  universidadNoEncontrada = false;
  universidad: UniversidadDTO | undefined;
  imagenPorDefecto: string =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnrtrI3kER6PYUADR5tjXQtwVvqj4kjiDZgRUf1SFWNQ&s';
  buscarUniversidad: boolean = false;
  universidadCreada: UniversidadDTO | undefined;

  iniciarFormAltaUniversidad(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      direccionWeb: [
        '',
        [Validators.required, Validators.pattern('https?://.+')],
      ],
      direccionFisica: ['', [Validators.required, Validators.minLength(10)]],
      descripcion: ['', [Validators.required, Validators.minLength(30)]],
      imagen: ['', [Validators.required]],
      nombreCarrera: [''],
      gradoCarrera: [''],
      duracionCarrera: [''],
    });
  }

  siguiente() {
    this.indice++;
  }

  anterior() {
    this.indice--;
  }

  guardarCalificacion(calificacion: CalificacionDTO) {
    this.listaCalificacionUniversidad.push(calificacion);
  }

  enviarFormulario(event: Event): void {
    event.preventDefault();

    const userId = Number(localStorage.getItem('userID'));
    if (!userId) {
      console.error('User ID no encontrado en localStorage');
      return;
    }

    const { nombre, direccionWeb, direccionFisica, descripcion } =
      this.formularioAltaUniversidad.value;

    const universidad: UniversidadDTO = {
      nombre,
      usuarioId: userId,
      direccionWeb,
      direccion: direccionFisica,
      descripcion,
      imagen: this.imagenPorDefecto,
      listaCarreras: this.listaCarrerasUniversidad,
      listaCalificacion: this.listaCalificacionUniversidad,
    };

    this.crearUniversidadYAsociarAUsuario(universidad, userId);
  }

  private crearUniversidadYAsociarAUsuario(
    universidad: UniversidadDTO,
    userId: number
  ): void {
    this.universidadService.crearUniversidad(universidad).subscribe({
      next: (universidadCreada: UniversidadDTO) => {
        this.agregarUniversidadAUsuario(universidadCreada, userId);
        this.asociarCarrerasAuniversidad(universidadCreada);
        this.alertasService.exito('¡Universidad agregada con exito!');
        this.universidadCreada = universidadCreada;
      },
      error: (err) => console.error('Error al crear la universidad:', err),
    });
  }

  private agregarUniversidadAUsuario(
    universidad: UniversidadDTO,
    userId: number
  ): void {
    this.usuarioService.getUsuarioById(userId).subscribe({
      next: (usuario: UsuarioDTO) => {
        usuario.listaUniversidad = usuario.listaUniversidad || [];
        usuario.listaUniversidad.push(universidad);
        this.usuarioService.editUsuario(usuario).subscribe({
          next: () => console.log('Universidad agregada al usuario con éxito'),
          error: (err) => console.error('Error al actualizar el usuario:', err),
        });
      },
      error: (err) => console.error('Error al obtener el usuario:', err),
    });
  }

  asociarCarrerasAuniversidad(universidad: UniversidadDTO) {
    universidad.listaCarreras?.forEach((carrera) => {
      carrera.universidadId = universidad.id;
      this.carreraService.editCarrera(carrera).subscribe();
    });
  }

  agregarCarreras() {
    const carrera: CarreraDTO = {
      activa: true,
      nombre: this.formularioAltaUniversidad.get('nombreCarrera')?.value,
      grado: this.formularioAltaUniversidad.get('gradoCarrera')?.value,
      duracion: this.formularioAltaUniversidad.get('duracionCarrera')?.value,
      idUsuario: Number(localStorage.getItem('userID'))
    };

    this.carreraService.crearCarrera(carrera).subscribe((carreraCreada) => {
      this.listaCarrerasUniversidad.push(carreraCreada);
      this.alertasService.exito('¡Carrera creada con exito!');
    });

    this.formularioAltaUniversidad.patchValue({
      nombreCarrera: '',
      gradoCarrera: '',
      duracionCarrera: '',
    });
  }

  changeImagen(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.imagenPorDefecto = inputValue;
  }

  manejadorErrorImagenUniversdiad() {
    this.imagenCargada = true;
  }

  manejadorExitoImagenUniversdiad() {
    this.imagenCargada = false;
  }

  manejarUniversidadesEncontradas(universidades: UniversidadDTO[]) {
    if (universidades.length > 0) {
      this.universidad = universidades[0];
      this.universidadNoEncontrada = false;
    } else {
      this.mostrarMensajeUniversidadNoEncontrada();
    }
  }

  private mostrarMensajeUniversidadNoEncontrada() {
    this.universidadNoEncontrada = true;
    setTimeout(() => {
      this.universidadNoEncontrada = false;
    }, 3000);
  }

  manejarImagenNoCargada(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src =
      'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
  }

  mostrarUnversidadBuscada() {
    this.buscarUniversidad = !this.buscarUniversidad;
  }

  errorImagen() {
    this.imagenPorDefecto =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnrtrI3kER6PYUADR5tjXQtwVvqj4kjiDZgRUf1SFWNQ&s';
  }
}

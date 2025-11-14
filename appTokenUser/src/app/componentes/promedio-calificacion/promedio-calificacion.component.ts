import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { CalificacionDTO } from 'src/app/modelo/calificacion';


@Component({
  selector: 'app-promedio-calificacion',
  templateUrl: './promedio-calificacion.component.html',
  styleUrls: ['./promedio-calificacion.component.css']
})
export class PromedioCalificacionComponent implements OnInit {

  //Obtengo la lista de calificaciones que se envio desde el elemento padre
  @Input() listaCalificacion: CalificacionDTO[] = [];

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  promedio: number = 0;
  cantidadCalificaciones: number = 0;

  ngOnInit(): void {
    this.promedio = this.calcularPromedio();
    this.pintarEstrellas(this.promedio);
  }


  calcularPromedio(): number {
    let acumuladorNotas: number = 0;
    let cantidadNotas: number = this.listaCalificacion.length;
    this.cantidadCalificaciones = cantidadNotas;


    // Sumar todas las notas
    this.listaCalificacion.forEach(calificacion => {
      if (calificacion.nota)
        acumuladorNotas += calificacion.nota;
    });

    let promedio: number = acumuladorNotas / cantidadNotas;


    return Math.round(promedio);
  }


  pintarEstrellas(estrellasLlenas: number) {
    const numEstrellasLlenas = Math.max(0, Math.min(5, estrellasLlenas));  // entre 0 y 5
    const numEstrellasVacias = 5 - numEstrellasLlenas;
    const estrellasHtml = '★'.repeat(numEstrellasLlenas) + '☆'.repeat(numEstrellasVacias);

    const elemento = this.el.nativeElement.querySelector('.ratingStars');
    this.renderer.setProperty(elemento, 'innerHTML', estrellasHtml);
  }


}

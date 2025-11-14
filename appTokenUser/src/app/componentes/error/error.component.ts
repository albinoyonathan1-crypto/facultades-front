import { Component, OnInit } from '@angular/core';
import { ErrorServiceService } from 'src/app/servicios/error-service.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  mensajeError: string | null = null;

  constructor(private errorService: ErrorServiceService) { }


  ngOnInit(): void {
    this.errorService.error.subscribe(
      (mensaje: string) => {
        this.mensajeError = "<-----Houston, tenemos un problema!!-----> ";
        this.mensajeError += mensaje;
        // Mover el foco al mensaje de error
        setTimeout(() => {
          const errorMessageElement = document.getElementById('errorMessage');
          if (errorMessageElement) {
            errorMessageElement.focus(); // Mover el foco al elemento
          }
        }, 0);

        setTimeout(() => {
          this.mensajeError = "";
        }, 5000);

      }
    )

  }

}

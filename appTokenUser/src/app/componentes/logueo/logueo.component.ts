import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLoguinResponseDTO } from 'src/app/modelo/auth-loguin-response-dto';
import { CredencialesLogueo } from 'src/app/modelo/credenciales-logueo';
import { PruebaService } from 'src/app/servicios/prueba.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { UtilService } from 'src/app/servicios/util.service';


@Component({
  selector: 'app-logueo',
  templateUrl: './logueo.component.html',
  styleUrls: ['./logueo.component.css']
})
export class LogueoComponent implements OnInit {

  ngOnInit(): void {
    const idUsuario = localStorage.getItem('userID');

  }

  constructor(private pruebaService: PruebaService, private usuarioService: UsuarioService,
    private router: Router,
    private util: UtilService) { }


  nombreUsuario: string = "";
  contrasenia: string = "";
  mostrarContrasenia: boolean = false;

  logueoOauth(): void {
    this.pruebaService.login();
  }

  loguin(nombreUsuario: string, contrasenia: string) {
    localStorage.clear();

    const credenciales: CredencialesLogueo = {
      nombreUsuario: nombreUsuario,
      contrasenia: contrasenia
    };

    this.usuarioService.loguin(credenciales).subscribe((AuthLoguinResponseDTO) => {
      this.util.agregarCredencialesASesion(AuthLoguinResponseDTO);
      this.util.redirectToHome();
    }, (error) => {
      console.error(error);
    })
  }


}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/servicios/socket.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private usuarioService: UsuarioService, private socketService:SocketService) {}
  rutaSeleccionada:string = "hole";
  loguado: boolean = false;

  ngOnInit(): void {
    this.usuarioService.idUsuarioActual.subscribe((id) => {
      if (id) this.loguado = true;
    });
  }

  salir() {
    this.socketService.desconectarYDesuscribir();
    localStorage.clear();
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.reload();
  }

  seleccionar(ruta:string){
    this.rutaSeleccionada = ruta;
  }
}

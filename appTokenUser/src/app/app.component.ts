import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './servicios/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'appTokenUser';
  
  constructor(private userService:UsuarioService){}

  ngOnInit(): void {
    this.userService.setUserId(Number(localStorage.getItem('userID')));
  }
}

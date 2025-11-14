import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SonidoService {

  private audioNotificacion: HTMLAudioElement;
  private audioError: HTMLAudioElement;
  private notificacionMensaje: HTMLAudioElement;
  private volumen:number = 0.2;


  constructor() {
    // Precargar sonidos para evitar retrasos
    this.audioNotificacion = new Audio('assets/sonidos/livechat-129007.mp3');
    this.audioError = new Audio('assets/sonidos/error-126627.mp3');
    this.notificacionMensaje = new Audio('assets/sonidos/messenger-tono-mensaje-.mp3')

    this.audioNotificacion.volume = this.volumen;
    this.audioError.volume = this.volumen;
    this.notificacionMensaje.volume = this.volumen;

    this.notificacionMensaje.load();
    this.audioNotificacion.load();
    this.audioError.load();
  }

  public notificacion() {
    this.audioNotificacion.currentTime = 0; // Reiniciar el sonido si ya está reproduciéndose
    this.audioNotificacion.play().catch(error => console.error('Error al reproducir sonido:', error));
  }

  public error() {
    this.audioError.currentTime = 0;
    this.audioError.play().catch(error => console.error('Error al reproducir sonido:', error));
  }

  public mensaje() {
    this.notificacionMensaje.currentTime = 0;
    this.notificacionMensaje.play().catch(error => console.error('Error al reproducir sonido:', error));
  }
}

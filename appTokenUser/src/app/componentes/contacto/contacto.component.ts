import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ContactoRequest } from 'src/app/modelo/contacto-request';
import { MensajeRetornoSimple } from 'src/app/modelo/mensaje-retorno-simple';
import { RegistroRequest } from 'src/app/modelo/registro-request';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ContactoService } from 'src/app/servicios/contacto.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  contactoForm: FormGroup;
  tokenCaptcha: string | undefined;
  cargando: boolean = false;

  constructor(private fb: FormBuilder, private alertaService: AlertasService, private contactoService: ContactoService) {
    this.contactoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.sinEspacios]],
      mensaje: ['', [Validators.required]],
      recaptcha: ['', Validators.required] // Agregar campo de reCAPTCHA
    })
  }

  //validacion para evitar espacios en blanco
  sinEspacios(control: AbstractControl): ValidationErrors | null {
    const tieneEspacios = /\s/.test(control.value); // Verifica si hay espacios en blanco
    return tieneEspacios ? { sinEspacios: true } : null; // Retorna error si hay espacios
  }

  enviar() {
    if (this.contactoForm.valid && this.tokenCaptcha) {
      this.cargando = true;
      const email = this.contactoForm.get('email')?.value?.trim(); // Eliminar espacios
      const mensaje = this.contactoForm.get('mensaje')?.value.trim();
      const contactoRequest: ContactoRequest = {
        captchaToken: this.tokenCaptcha, // Token obtenido del reCAPTCHA
        email: email,
        mensaje: mensaje
      }

      // Llamada al servicio de registro
      this.contactoService.enviarMensaje(contactoRequest).subscribe(
        (mensajeRetornoSimple: MensajeRetornoSimple) => {
          this.contactoForm.reset(); // Limpia todos los campos del formulario
          this.cargando = false;
          this.alertaService.exito(mensajeRetornoSimple.mensaje);
        });

    } else {
      console.log("error")
      // Si el formulario no es válido o el reCAPTCHA no ha sido resuelto
      this.contactoForm.markAllAsTouched();
    }
  }



  // Método que se ejecuta cuando el reCAPTCHA es resuelto
  onCaptchaResolved($event: string) {
    this.tokenCaptcha = $event;
    this.contactoForm.get('recaptcha')?.setValue(this.tokenCaptcha);
    this.contactoForm.get('recaptcha')?.markAsTouched();  // Marcar como tocado
    console.log($event)
  }

}
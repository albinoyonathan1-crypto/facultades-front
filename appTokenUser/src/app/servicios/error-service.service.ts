import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorServiceService {

  constructor() { }

  private errorSubject = new Subject<string>();
  error = this.errorSubject.asObservable();

  reportError(mensaje: string) {
    this.errorSubject.next(mensaje);
  }
}

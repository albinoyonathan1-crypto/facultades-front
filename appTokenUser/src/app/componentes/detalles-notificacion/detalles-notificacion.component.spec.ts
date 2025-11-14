import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesNotificacionComponent } from './detalles-notificacion.component';

describe('DetallesNotificacionComponent', () => {
  let component: DetallesNotificacionComponent;
  let fixture: ComponentFixture<DetallesNotificacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallesNotificacionComponent]
    });
    fixture = TestBed.createComponent(DetallesNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

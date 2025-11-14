import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromedioCalificacionComponent } from './promedio-calificacion.component';

describe('PromedioCalificacionComponent', () => {
  let component: PromedioCalificacionComponent;
  let fixture: ComponentFixture<PromedioCalificacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromedioCalificacionComponent]
    });
    fixture = TestBed.createComponent(PromedioCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

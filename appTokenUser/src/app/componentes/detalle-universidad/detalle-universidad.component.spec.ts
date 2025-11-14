import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleUniversidadComponent } from './detalle-universidad.component';

describe('DetalleUniversidadComponent', () => {
  let component: DetalleUniversidadComponent;
  let fixture: ComponentFixture<DetalleUniversidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleUniversidadComponent]
    });
    fixture = TestBed.createComponent(DetalleUniversidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

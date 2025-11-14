import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarUniversidadComponent } from './agregar-universidad.component';

describe('AgregarUniversidadComponent', () => {
  let component: AgregarUniversidadComponent;
  let fixture: ComponentFixture<AgregarUniversidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgregarUniversidadComponent]
    });
    fixture = TestBed.createComponent(AgregarUniversidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

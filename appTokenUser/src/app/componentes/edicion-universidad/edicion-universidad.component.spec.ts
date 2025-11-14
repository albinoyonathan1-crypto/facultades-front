import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionUniversidadComponent } from './edicion-universidad.component';

describe('EdicionUniversidadComponent', () => {
  let component: EdicionUniversidadComponent;
  let fixture: ComponentFixture<EdicionUniversidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EdicionUniversidadComponent]
    });
    fixture = TestBed.createComponent(EdicionUniversidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

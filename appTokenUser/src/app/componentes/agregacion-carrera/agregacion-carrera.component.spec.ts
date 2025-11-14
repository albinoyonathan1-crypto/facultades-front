import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregacionCarreraComponent } from './agregacion-carrera.component';

describe('AgregacionCarreraComponent', () => {
  let component: AgregacionCarreraComponent;
  let fixture: ComponentFixture<AgregacionCarreraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgregacionCarreraComponent]
    });
    fixture = TestBed.createComponent(AgregacionCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

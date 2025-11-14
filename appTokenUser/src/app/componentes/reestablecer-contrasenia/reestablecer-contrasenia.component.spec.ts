import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReestablecerContraseniaComponent } from './reestablecer-contrasenia.component';

describe('ReestablecerContraseniaComponent', () => {
  let component: ReestablecerContraseniaComponent;
  let fixture: ComponentFixture<ReestablecerContraseniaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReestablecerContraseniaComponent]
    });
    fixture = TestBed.createComponent(ReestablecerContraseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

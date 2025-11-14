import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenVerificacionErrorComponent } from './token-verificacion-error.component';

describe('TokenVerificacionErrorComponent', () => {
  let component: TokenVerificacionErrorComponent;
  let fixture: ComponentFixture<TokenVerificacionErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TokenVerificacionErrorComponent]
    });
    fixture = TestBed.createComponent(TokenVerificacionErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

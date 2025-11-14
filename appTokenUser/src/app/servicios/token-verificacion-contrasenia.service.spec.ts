import { TestBed } from '@angular/core/testing';

import { TokenVerificacionContraseniaService } from './token-verificacion-contrasenia.service';

describe('TokenVerificacionContraseniaService', () => {
  let service: TokenVerificacionContraseniaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenVerificacionContraseniaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TokenVerificacionEmailService } from './token-verificacion-email.service';

describe('TokenVerificacionEmailService', () => {
  let service: TokenVerificacionEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenVerificacionEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

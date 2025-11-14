import { TestBed } from '@angular/core/testing';

import { UsuarioLeidoServiceService } from './usuario-leido-service.service';

describe('UsuarioLeidoServiceService', () => {
  let service: UsuarioLeidoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioLeidoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

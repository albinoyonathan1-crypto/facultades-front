import { TestBed } from '@angular/core/testing';

import { SonidoServiceService } from './sonido-service.service';

describe('SonidoServiceService', () => {
  let service: SonidoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SonidoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

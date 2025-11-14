import { TestBed } from '@angular/core/testing';

import { WebSocketConexionesService } from './web-socket-conexiones.service';

describe('WebSocketConexionesService', () => {
  let service: WebSocketConexionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketConexionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { EventosDeportivosService } from './eventos-deportivos.service';

describe('EventosDeportivosService', () => {
  let service: EventosDeportivosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventosDeportivosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

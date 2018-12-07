import { TestBed, inject } from '@angular/core/testing';

import { BantahanService } from './bantahan.service';

describe('BantahanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BantahanService]
    });
  });

  it('should be created', inject([BantahanService], (service: BantahanService) => {
    expect(service).toBeTruthy();
  }));
});

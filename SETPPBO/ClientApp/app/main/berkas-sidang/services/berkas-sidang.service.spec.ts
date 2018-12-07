import { TestBed, inject } from '@angular/core/testing';

import { BerkasSidangService } from './berkas-sidang.service';

describe('BerkasSidangService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BerkasSidangService]
    });
  });

  it('should be created', inject([BerkasSidangService], (service: BerkasSidangService) => {
    expect(service).toBeTruthy();
  }));
});

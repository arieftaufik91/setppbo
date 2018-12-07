import { TestBed, inject } from '@angular/core/testing';

import { BerkasSiapSidangService } from './berkas-siap-sidang.service';

describe('BerkasSiapSidangService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BerkasSiapSidangService]
    });
  });

  it('should be created', inject([BerkasSiapSidangService], (service: BerkasSiapSidangService) => {
    expect(service).toBeTruthy();
  }));
});

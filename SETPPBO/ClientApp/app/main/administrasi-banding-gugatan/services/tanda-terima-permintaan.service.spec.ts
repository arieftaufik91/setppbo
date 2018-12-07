import { TestBed, inject } from '@angular/core/testing';

import { TandaTerimaPermintaanService } from './tanda-terima-permintaan.service';

describe('TandaTerimaPermintaanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TandaTerimaPermintaanService]
    });
  });

  it('should be created', inject([TandaTerimaPermintaanService], (service: TandaTerimaPermintaanService) => {
    expect(service).toBeTruthy();
  }));
});

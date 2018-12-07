import { TestBed, inject } from '@angular/core/testing';

import { PermintaanBantahanService } from './permintaan-bantahan.service';

describe('PermintaanBantahanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermintaanBantahanService]
    });
  });

  it('should be created', inject([PermintaanBantahanService], (service: PermintaanBantahanService) => {
    expect(service).toBeTruthy();
  }));
});

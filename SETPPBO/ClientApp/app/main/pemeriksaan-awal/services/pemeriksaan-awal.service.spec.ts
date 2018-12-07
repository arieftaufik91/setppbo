import { TestBed, inject } from '@angular/core/testing';

import { PemeriksaanAwalService } from './pemeriksaan-awal.service';

describe('PemeriksaanAwalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PemeriksaanAwalService]
    });
  });

  it('should be created', inject([PemeriksaanAwalService], (service: PemeriksaanAwalService) => {
    expect(service).toBeTruthy();
  }));
});

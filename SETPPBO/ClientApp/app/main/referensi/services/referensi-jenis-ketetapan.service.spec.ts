import { TestBed, inject } from '@angular/core/testing';

import { ReferensiJenisKetetapanService } from './referensi-jenis-ketetapan.service';

describe('ReferensiJenisKetetapanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReferensiJenisKetetapanService]
    });
  });

  it('should be created', inject([ReferensiJenisKetetapanService], (service: ReferensiJenisKetetapanService) => {
    expect(service).toBeTruthy();
  }));
});

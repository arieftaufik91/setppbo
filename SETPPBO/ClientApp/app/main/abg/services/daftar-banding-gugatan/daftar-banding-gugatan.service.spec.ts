import { TestBed, inject } from '@angular/core/testing';

import { DaftarBandingGugatanService } from './daftar-banding-gugatan.service';

describe('DaftarBandingGugatanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DaftarBandingGugatanService]
    });
  });

  it('should be created', inject([DaftarBandingGugatanService], (service: DaftarBandingGugatanService) => {
    expect(service).toBeTruthy();
  }));
});

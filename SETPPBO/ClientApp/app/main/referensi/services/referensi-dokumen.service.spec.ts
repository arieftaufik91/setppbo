import { TestBed, inject } from '@angular/core/testing';

import { ReferensiDokumenService } from './referensi-dokumen.service';

describe('ReferensiDokumenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReferensiDokumenService]
    });
  });

  it('should be created', inject([ReferensiDokumenService], (service: ReferensiDokumenService) => {
    expect(service).toBeTruthy();
  }));
});

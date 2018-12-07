import { TestBed, inject } from '@angular/core/testing';

import { ReferensiJenisPajakService } from './referensi-jenis-pajak.service';

describe('ReferensiJenisPajakService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReferensiJenisPajakService]
    });
  });

  it('should be created', inject([ReferensiJenisPajakService], (service: ReferensiJenisPajakService) => {
    expect(service).toBeTruthy();
  }));
});

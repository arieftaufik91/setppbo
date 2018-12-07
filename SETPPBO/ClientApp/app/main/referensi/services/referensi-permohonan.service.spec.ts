import { TestBed, inject } from '@angular/core/testing';

import { ReferensiPermohonanService } from './referensi-permohonan.service';

describe('ReferensiPermohonanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReferensiPermohonanService]
    });
  });

  it('should be created', inject([ReferensiPermohonanService], (service: ReferensiPermohonanService) => {
    expect(service).toBeTruthy();
  }));
});

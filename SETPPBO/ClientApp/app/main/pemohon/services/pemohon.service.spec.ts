import { TestBed, inject } from '@angular/core/testing';

import { PemohonService } from './pemohon.service';

describe('PemohonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PemohonService]
    });
  });

  it('should be created', inject([PemohonService], (service: PemohonService) => {
    expect(service).toBeTruthy();
  }));
});

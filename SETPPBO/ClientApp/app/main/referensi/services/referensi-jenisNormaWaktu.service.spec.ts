import { TestBed, inject } from '@angular/core/testing';

import { RefjenisnormawaktuService } from './referensi-jenisNormaWaktu.service';

describe('RefjenisnormawaktuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefjenisnormawaktuService]
    });
  });

  it('should be created', inject([RefjenisnormawaktuService], (service: RefjenisnormawaktuService) => {
    expect(service).toBeTruthy();
  }));
});

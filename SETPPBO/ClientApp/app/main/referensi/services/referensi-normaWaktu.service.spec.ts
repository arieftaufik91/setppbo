import { TestBed, inject } from '@angular/core/testing';

import { RefnormawaktuService } from './referensi-normaWaktu.service';

describe('RefnormawaktuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefnormawaktuService]
    });
  });

  it('should be created', inject([RefnormawaktuService], (service: RefnormawaktuService) => {
    expect(service).toBeTruthy();
  }));
});

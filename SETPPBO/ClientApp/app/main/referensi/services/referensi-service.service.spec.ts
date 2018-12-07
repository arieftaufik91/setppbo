import { TestBed, inject } from '@angular/core/testing';

import { ReferensiServiceService } from './referensi-service.service';

describe('ReferensiServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReferensiServiceService]
    });
  });

  it('should be created', inject([ReferensiServiceService], (service: ReferensiServiceService) => {
    expect(service).toBeTruthy();
  }));
});

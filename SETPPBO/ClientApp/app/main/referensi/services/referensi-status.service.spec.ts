import { TestBed, inject } from '@angular/core/testing';

import { ReferensiStatusService } from './referensi-status.service';

describe('ReferensiStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReferensiStatusService]
    });
  });

  it('should be created', inject([ReferensiStatusService], (service: ReferensiStatusService) => {
    expect(service).toBeTruthy();
  }));
});

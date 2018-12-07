import { TestBed, inject } from '@angular/core/testing';

import { ReferensimajelisService } from './referensi-majelis.service';

describe('ReferensiMajelisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReferensimajelisService]
    });
  });

  it('should be created', inject([ReferensimajelisService], (service: ReferensimajelisService) => {
    expect(service).toBeTruthy();
  }));
});

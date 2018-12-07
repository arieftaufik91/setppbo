import { TestBed, inject } from '@angular/core/testing';

import { TandaTerimaSubstService } from './tanda-terima-subst.service';

describe('TandaTerimaSubstService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TandaTerimaSubstService]
    });
  });

  it('should be created', inject([TandaTerimaSubstService], (service: TandaTerimaSubstService) => {
    expect(service).toBeTruthy();
  }));
});

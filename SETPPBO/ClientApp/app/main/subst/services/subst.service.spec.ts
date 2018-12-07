import { TestBed, inject } from '@angular/core/testing';

import { SubstService } from './subst.service';

describe('SubstService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubstService]
    });
  });

  it('should be created', inject([SubstService], (service: SubstService) => {
    expect(service).toBeTruthy();
  }));
});

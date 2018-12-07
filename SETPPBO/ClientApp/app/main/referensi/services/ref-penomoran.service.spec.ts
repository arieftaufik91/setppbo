import { TestBed, inject } from '@angular/core/testing';

import { RefPenomoranService } from './ref-penomoran.service';

describe('RefPenomoranService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefPenomoranService]
    });
  });

  it('should be created', inject([RefPenomoranService], (service: RefPenomoranService) => {
    expect(service).toBeTruthy();
  }));
});

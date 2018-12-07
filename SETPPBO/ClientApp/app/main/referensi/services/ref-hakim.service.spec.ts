import { TestBed, inject } from '@angular/core/testing';

import { RefHakimService } from './ref-hakim.service';

describe('RefHakimService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefHakimService]
    });
  });

  it('should be created', inject([RefHakimService], (service: RefHakimService) => {
    expect(service).toBeTruthy();
  }));
});

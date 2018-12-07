import { TestBed, inject } from '@angular/core/testing';

import { DistribusiService } from './distribusi.service';

describe('DistribusiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DistribusiService]
    });
  });

  it('should be created', inject([DistribusiService], (service: DistribusiService) => {
    expect(service).toBeTruthy();
  }));
});

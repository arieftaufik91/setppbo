import { TestBed, inject } from '@angular/core/testing';

import { RefAlasanService } from './ref-alasan.service';

describe('RefAlasanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefAlasanService]
    });
  });

  it('should be created', inject([RefAlasanService], (service: RefAlasanService) => {
    expect(service).toBeTruthy();
  }));
});

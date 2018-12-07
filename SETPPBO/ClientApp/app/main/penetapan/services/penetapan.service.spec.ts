import { TestBed, inject } from '@angular/core/testing';

import { PenetapanService } from './penetapan.service';

describe('PenetapanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PenetapanService]
    });
  });

  it('should be created', inject([PenetapanService], (service: PenetapanService) => {
    expect(service).toBeTruthy();
  }));
});

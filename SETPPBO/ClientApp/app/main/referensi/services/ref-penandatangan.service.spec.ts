import { TestBed, inject } from '@angular/core/testing';

import { RefPenandatanganService } from './ref-penandatangan.service';

describe('RefPenandatanganService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefPenandatanganService]
    });
  });

  it('should be created', inject([RefPenandatanganService], (service: RefPenandatanganService) => {
    expect(service).toBeTruthy();
  }));
});

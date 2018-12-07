import { TestBed, inject } from '@angular/core/testing';

import { RefKodeTermohonService } from './ref-kode-termohon.service';

describe('RefKodeTermohonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefKodeTermohonService]
    });
  });

  it('should be created', inject([RefKodeTermohonService], (service: RefKodeTermohonService) => {
    expect(service).toBeTruthy();
  }));
});

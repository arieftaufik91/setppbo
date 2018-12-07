import { TestBed, inject } from '@angular/core/testing';

import { KodeTermohonService } from './kode-termohon.service';

describe('KodeTermohonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KodeTermohonService]
    });
  });

  it('should be created', inject([KodeTermohonService], (service: KodeTermohonService) => {
    expect(service).toBeTruthy();
  }));
});

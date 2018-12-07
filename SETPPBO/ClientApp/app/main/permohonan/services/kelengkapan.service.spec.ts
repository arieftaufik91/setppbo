import { TestBed, inject } from '@angular/core/testing';

import { KelengkapanService } from './kelengkapan.service';

describe('KelengkapanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KelengkapanService]
    });
  });

  it('should be created', inject([KelengkapanService], (service: KelengkapanService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { KotaService } from './kota.service';

describe('KotaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KotaService]
    });
  });

  it('should be created', inject([KotaService], (service: KotaService) => {
    expect(service).toBeTruthy();
  }));
});

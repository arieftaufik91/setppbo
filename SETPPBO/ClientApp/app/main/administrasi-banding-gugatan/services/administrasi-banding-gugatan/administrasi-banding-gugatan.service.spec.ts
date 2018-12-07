import { TestBed, inject } from '@angular/core/testing';

import { AdministrasiBandingGugatanService } from './administrasi-banding-gugatan.service';

describe('AdministrasiBandingGugatanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdministrasiBandingGugatanService]
    });
  });

  it('should be created', inject([AdministrasiBandingGugatanService], (service: AdministrasiBandingGugatanService) => {
    expect(service).toBeTruthy();
  }));
});

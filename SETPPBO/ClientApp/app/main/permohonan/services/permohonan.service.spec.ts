import { TestBed, inject } from '@angular/core/testing';

import { PermohonanService } from './permohonan.service';

describe('PermohonanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermohonanService]
    });
  });

  it('should be created', inject([PermohonanService], (service: PermohonanService) => {
    expect(service).toBeTruthy();
  }));
});

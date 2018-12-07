import { TestBed, inject } from '@angular/core/testing';

import { RefjenispermohonanService } from './referensi-jenisPermohonan.service';

describe('RefjenispermohonanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefjenispermohonanService]
    });
  });

  it('should be created', inject([RefjenispermohonanService], (service: RefjenispermohonanService) => {
    expect(service).toBeTruthy();
  }));
});

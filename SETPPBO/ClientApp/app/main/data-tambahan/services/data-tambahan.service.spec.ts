import { TestBed, inject } from '@angular/core/testing';

import { DataTambahanService } from './data-tambahan.service';

describe('DataTambahanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataTambahanService]
    });
  });

  it('should be created', inject([DataTambahanService], (service: DataTambahanService) => {
    expect(service).toBeTruthy();
  }));
});

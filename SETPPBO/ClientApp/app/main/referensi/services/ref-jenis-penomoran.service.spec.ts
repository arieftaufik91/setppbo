import { TestBed, inject } from '@angular/core/testing';

import { RefJenisPenomoranService } from './ref-jenis-penomoran.service';

describe('RefJenisPenomoranService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefJenisPenomoranService]
    });
  });

  it('should be created', inject([RefJenisPenomoranService], (service: RefJenisPenomoranService) => {
    expect(service).toBeTruthy();
  }));
});

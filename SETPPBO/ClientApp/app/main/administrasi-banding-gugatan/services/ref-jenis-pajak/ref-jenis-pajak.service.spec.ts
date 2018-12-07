import { TestBed, inject } from '@angular/core/testing';

import { RefJenisPajakService } from './ref-jenis-pajak.service';

describe('RefJenisPajakService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefJenisPajakService]
    });
  });

  it('should be created', inject([RefJenisPajakService], (service: RefJenisPajakService) => {
    expect(service).toBeTruthy();
  }));
});

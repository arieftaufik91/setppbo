import { TestBed, inject } from '@angular/core/testing';

import { RefcarakirimpermohonanService } from './refcarakirimpermohonan.service';

describe('RefcarakirimpermohonanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefcarakirimpermohonanService]
    });
  });

  it('should be created', inject([RefcarakirimpermohonanService], (service: RefcarakirimpermohonanService) => {
    expect(service).toBeTruthy();
  }));
});

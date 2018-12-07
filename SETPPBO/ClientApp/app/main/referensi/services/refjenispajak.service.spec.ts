import { TestBed, inject } from '@angular/core/testing';

import { RefjenispajakService } from './refjenispajak.service';

describe('RefjenispajakService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefjenispajakService]
    });
  });

  it('should be created', inject([RefjenispajakService], (service: RefjenispajakService) => {
    expect(service).toBeTruthy();
  }));
});

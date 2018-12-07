import { TestBed, inject } from '@angular/core/testing';

import { RefmajelisService } from './refmajelis.service';

describe('RefmajelisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefmajelisService]
    });
  });

  it('should be created', inject([RefmajelisService], (service: RefmajelisService) => {
    expect(service).toBeTruthy();
  }));
});

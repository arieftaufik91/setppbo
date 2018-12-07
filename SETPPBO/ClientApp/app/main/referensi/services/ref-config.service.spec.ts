import { TestBed, inject } from '@angular/core/testing';

import { RefConfigService } from './ref-config.service';

describe('RefConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefConfigService]
    });
  });

  it('should be created', inject([RefConfigService], (service: RefConfigService) => {
    expect(service).toBeTruthy();
  }));
});

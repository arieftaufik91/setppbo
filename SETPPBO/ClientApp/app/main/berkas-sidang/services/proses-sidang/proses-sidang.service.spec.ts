import { TestBed, inject } from '@angular/core/testing';

import { ProsesSidangService } from './proses-sidang.service';

describe('ProsesSidangService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProsesSidangService]
    });
  });

  it('should be created', inject([ProsesSidangService], (service: ProsesSidangService) => {
    expect(service).toBeTruthy();
  }));
});

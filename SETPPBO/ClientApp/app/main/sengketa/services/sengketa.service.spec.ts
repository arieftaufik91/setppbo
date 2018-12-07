import { TestBed, inject } from '@angular/core/testing';

import { SengketaService } from './sengketa.service';

describe('SengketaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SengketaService]
    });
  });

  it('should be created', inject([SengketaService], (service: SengketaService) => {
    expect(service).toBeTruthy();
  }));
});

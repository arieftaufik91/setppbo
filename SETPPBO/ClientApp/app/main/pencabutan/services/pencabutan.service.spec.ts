import { TestBed, inject } from '@angular/core/testing';

import { PencabutanService } from './pencabutan.service';

describe('PencabutanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PencabutanService]
    });
  });

  it('should be created', inject([PencabutanService], (service: PencabutanService) => {
    expect(service).toBeTruthy();
  }));
});

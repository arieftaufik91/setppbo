import { TestBed, inject } from '@angular/core/testing';

import { LayoutNavService } from './layout-nav.service';

describe('LayoutNavService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutNavService]
    });
  });

  it('should be created', inject([LayoutNavService], (service: LayoutNavService) => {
    expect(service).toBeTruthy();
  }));
});

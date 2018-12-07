import { TestBed, inject } from '@angular/core/testing';

import { RefOrganisasiService } from './ref-organisasi.service';

describe('RefOrganisasiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefOrganisasiService]
    });
  });

  it('should be created', inject([RefOrganisasiService], (service: RefOrganisasiService) => {
    expect(service).toBeTruthy();
  }));
});

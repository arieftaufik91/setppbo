import { TestBed, inject } from '@angular/core/testing';

import { PenyampaianSalinanBantahanService } from './penyampaian-salinan-bantahan.service';

describe('PenyampaianSalinanBantahanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PenyampaianSalinanBantahanService]
    });
  });

  it('should be created', inject([PenyampaianSalinanBantahanService], (service: PenyampaianSalinanBantahanService) => {
    expect(service).toBeTruthy();
  }));
});

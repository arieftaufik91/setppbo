import { TestBed, inject } from '@angular/core/testing';

import { ReferensiTemplateService } from './referensi-template.service';

describe('ReferensiTemplateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReferensiTemplateService]
    });
  });

  it('should be created', inject([ReferensiTemplateService], (service: ReferensiTemplateService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { AuditSengketaService } from './audit-sengketa.service';

describe('AuditSengketaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditSengketaService]
    });
  });

  it('should be created', inject([AuditSengketaService], (service: AuditSengketaService) => {
    expect(service).toBeTruthy();
  }));
});

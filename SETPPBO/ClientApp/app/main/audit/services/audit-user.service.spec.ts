import { TestBed, inject } from '@angular/core/testing';

import { AuditUserService } from './audit-user.service';

describe('AuditUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditUserService]
    });
  });

  it('should be created', inject([AuditUserService], (service: AuditUserService) => {
    expect(service).toBeTruthy();
  }));
});

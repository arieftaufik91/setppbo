import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditUserDetailComponent } from './audit-user-detail.component';

describe('AuditUserDetailComponent', () => {
  let component: AuditUserDetailComponent;
  let fixture: ComponentFixture<AuditUserDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditUserDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditUserComponent } from './audit-user.component';

describe('AuditUserComponent', () => {
  let component: AuditUserComponent;
  let fixture: ComponentFixture<AuditUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

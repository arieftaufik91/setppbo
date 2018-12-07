import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditSengketaDetailComponent } from './audit-sengketa-detail.component';

describe('AuditSengketaDetailComponent', () => {
  let component: AuditSengketaDetailComponent;
  let fixture: ComponentFixture<AuditSengketaDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditSengketaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditSengketaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

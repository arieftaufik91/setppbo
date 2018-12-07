import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditSengketaComponent } from './audit-sengketa.component';

describe('AuditSengketaComponent', () => {
  let component: AuditSengketaComponent;
  let fixture: ComponentFixture<AuditSengketaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditSengketaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditSengketaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PemohonVerificationComponent } from './pemohon-verification.component';

describe('PemohonVerificationComponent', () => {
  let component: PemohonVerificationComponent;
  let fixture: ComponentFixture<PemohonVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PemohonVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PemohonVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

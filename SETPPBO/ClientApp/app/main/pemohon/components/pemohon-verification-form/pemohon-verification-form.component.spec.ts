import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PemohonVerificationFormComponent } from './pemohon-verification-form.component';

describe('PemohonVerificationFormComponent', () => {
  let component: PemohonVerificationFormComponent;
  let fixture: ComponentFixture<PemohonVerificationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PemohonVerificationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PemohonVerificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

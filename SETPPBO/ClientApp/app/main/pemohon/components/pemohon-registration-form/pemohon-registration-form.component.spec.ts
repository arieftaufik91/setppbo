import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PemohonRegistrationFormComponent } from './pemohon-registration-form.component';

describe('PemohonRegistrationFormComponent', () => {
  let component: PemohonRegistrationFormComponent;
  let fixture: ComponentFixture<PemohonRegistrationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PemohonRegistrationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PemohonRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

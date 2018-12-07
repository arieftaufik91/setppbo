import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermohonanValidasiInformationComponent } from './permohonan-validasi-information.component';

describe('PermohonanValidasiInformationComponent', () => {
  let component: PermohonanValidasiInformationComponent;
  let fixture: ComponentFixture<PermohonanValidasiInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermohonanValidasiInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermohonanValidasiInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

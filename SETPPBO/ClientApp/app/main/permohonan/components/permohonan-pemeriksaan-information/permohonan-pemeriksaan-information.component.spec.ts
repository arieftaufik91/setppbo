import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermohonanPemeriksaanInformationComponent } from './permohonan-pemeriksaan-information.component';

describe('PermohonanPemeriksaanInformationComponent', () => {
  let component: PermohonanPemeriksaanInformationComponent;
  let fixture: ComponentFixture<PermohonanPemeriksaanInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermohonanPemeriksaanInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermohonanPemeriksaanInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

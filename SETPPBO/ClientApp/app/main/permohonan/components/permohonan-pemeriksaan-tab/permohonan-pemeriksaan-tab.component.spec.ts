import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermohonanPemeriksaanTabComponent } from './permohonan-pemeriksaan-tab.component';

describe('PermohonanPemeriksaanTabComponent', () => {
  let component: PermohonanPemeriksaanTabComponent;
  let fixture: ComponentFixture<PermohonanPemeriksaanTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermohonanPemeriksaanTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermohonanPemeriksaanTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

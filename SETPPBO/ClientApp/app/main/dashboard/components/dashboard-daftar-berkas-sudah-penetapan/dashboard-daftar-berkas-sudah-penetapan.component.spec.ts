import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDaftarBerkasSudahPenetapanComponent } from './dashboard-daftar-berkas-sudah-penetapan.component';

describe('DashboardSidangComponent', () => {
  let component: DashboardDaftarBerkasSudahPenetapanComponent;
  let fixture: ComponentFixture<DashboardDaftarBerkasSudahPenetapanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDaftarBerkasSudahPenetapanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDaftarBerkasSudahPenetapanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

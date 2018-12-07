import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDaftarBerkasSudahDistribusiComponent } from './dashboard-daftar-berkas-sudah-distribusi.component';

describe('DashboardDistribusiComponent', () => {
  let component: DashboardDaftarBerkasSudahDistribusiComponent;
  let fixture: ComponentFixture<DashboardDaftarBerkasSudahDistribusiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDaftarBerkasSudahDistribusiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDaftarBerkasSudahDistribusiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

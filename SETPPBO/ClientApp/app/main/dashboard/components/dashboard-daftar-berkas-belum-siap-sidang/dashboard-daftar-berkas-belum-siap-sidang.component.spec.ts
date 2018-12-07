import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDaftarBerkasBelumSiapSidangComponent } from './dashboard-daftar-berkas-belum-siap-sidang.component';

describe('DashboardSengketaComponent', () => {
  let component: DashboardDaftarBerkasBelumSiapSidangComponent;
  let fixture: ComponentFixture<DashboardDaftarBerkasBelumSiapSidangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDaftarBerkasBelumSiapSidangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDaftarBerkasBelumSiapSidangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

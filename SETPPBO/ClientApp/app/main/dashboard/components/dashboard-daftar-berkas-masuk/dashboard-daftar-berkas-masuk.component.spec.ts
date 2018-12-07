import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDaftarBerkasMasukComponent } from './dashboard-daftar-berkas-masuk.component';

describe('DashboardListComponent', () => {
  let component: DashboardDaftarBerkasMasukComponent;
  let fixture: ComponentFixture<DashboardDaftarBerkasMasukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDaftarBerkasMasukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDaftarBerkasMasukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

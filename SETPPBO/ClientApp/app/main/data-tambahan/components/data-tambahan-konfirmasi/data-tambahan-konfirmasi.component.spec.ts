import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTambahanKonfirmasiComponent } from './data-tambahan-konfirmasi.component';

describe('DataTambahanKonfirmasiComponent', () => {
  let component: DataTambahanKonfirmasiComponent;
  let fixture: ComponentFixture<DataTambahanKonfirmasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTambahanKonfirmasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTambahanKonfirmasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

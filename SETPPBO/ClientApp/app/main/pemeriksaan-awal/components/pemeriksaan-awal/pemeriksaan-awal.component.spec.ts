import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PemeriksaanAwalComponent } from './pemeriksaan-awal.component';

describe('PemeriksaanAwalComponent', () => {
  let component: PemeriksaanAwalComponent;
  let fixture: ComponentFixture<PemeriksaanAwalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PemeriksaanAwalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PemeriksaanAwalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

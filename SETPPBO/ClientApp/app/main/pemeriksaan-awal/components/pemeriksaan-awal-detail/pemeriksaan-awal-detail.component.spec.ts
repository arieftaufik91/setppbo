import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PemeriksaanAwalDetailComponent } from './pemeriksaan-awal-detail.component';

describe('PemeriksaanAwalDetailComponent', () => {
  let component: PemeriksaanAwalDetailComponent;
  let fixture: ComponentFixture<PemeriksaanAwalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PemeriksaanAwalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PemeriksaanAwalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PemeriksaanAwalInformationComponent } from './pemeriksaan-awal-information.component';

describe('PemeriksaanAwalInformationComponent', () => {
  let component: PemeriksaanAwalInformationComponent;
  let fixture: ComponentFixture<PemeriksaanAwalInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PemeriksaanAwalInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PemeriksaanAwalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

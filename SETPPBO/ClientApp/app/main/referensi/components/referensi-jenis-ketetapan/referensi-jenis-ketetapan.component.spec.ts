import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiJenisKetetapanComponent } from './referensi-jenis-ketetapan.component';

describe('ReferensiJenisKetetapanComponent', () => {
  let component: ReferensiJenisKetetapanComponent;
  let fixture: ComponentFixture<ReferensiJenisKetetapanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferensiJenisKetetapanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferensiJenisKetetapanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

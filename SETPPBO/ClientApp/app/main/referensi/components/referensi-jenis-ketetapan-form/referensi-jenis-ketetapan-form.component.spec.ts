import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiJenisKetetapanFormComponent } from './referensi-jenis-ketetapan-form.component';

describe('ReferensiJenisKetetapanFormComponent', () => {
  let component: ReferensiJenisKetetapanFormComponent;
  let fixture: ComponentFixture<ReferensiJenisKetetapanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferensiJenisKetetapanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferensiJenisKetetapanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

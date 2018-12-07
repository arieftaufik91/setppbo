import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiJenisPajakComponent } from './referensi-jenis-pajak.component';

describe('ReferensiJenisPajakComponent', () => {
  let component: ReferensiJenisPajakComponent;
  let fixture: ComponentFixture<ReferensiJenisPajakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferensiJenisPajakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferensiJenisPajakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

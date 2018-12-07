import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermohonanValidasiListComponent } from './permohonan-validasi-list.component';

describe('PermohonanValidasiListComponent', () => {
  let component: PermohonanValidasiListComponent;
  let fixture: ComponentFixture<PermohonanValidasiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermohonanValidasiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermohonanValidasiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermohonanValidasiTabComponent } from './permohonan-validasi-tab.component';

describe('PermohonanValidasiTabComponent', () => {
  let component: PermohonanValidasiTabComponent;
  let fixture: ComponentFixture<PermohonanValidasiTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermohonanValidasiTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermohonanValidasiTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

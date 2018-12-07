import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiPermohonanComponent } from './referensi-permohonan.component';

describe('ReferensiPermohonanComponent', () => {
  let component: ReferensiPermohonanComponent;
  let fixture: ComponentFixture<ReferensiPermohonanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferensiPermohonanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferensiPermohonanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

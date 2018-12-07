import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiPermohonanFormComponent } from './referensi-permohonan-form.component';

describe('ReferensiPermohonanFormComponent', () => {
  let component: ReferensiPermohonanFormComponent;
  let fixture: ComponentFixture<ReferensiPermohonanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferensiPermohonanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferensiPermohonanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

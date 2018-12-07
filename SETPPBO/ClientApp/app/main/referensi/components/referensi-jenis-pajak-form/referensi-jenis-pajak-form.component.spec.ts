import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiJenisPajakFormComponent } from './referensi-jenis-pajak-form.component';

describe('ReferensiJenisPajakFormComponent', () => {
  let component: ReferensiJenisPajakFormComponent;
  let fixture: ComponentFixture<ReferensiJenisPajakFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferensiJenisPajakFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferensiJenisPajakFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

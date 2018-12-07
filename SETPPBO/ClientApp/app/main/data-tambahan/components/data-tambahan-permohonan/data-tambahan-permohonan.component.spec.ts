import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTambahanPermohonanComponent } from './data-tambahan-permohonan.component';

describe('DataTambahanPermohonanComponent', () => {
  let component: DataTambahanPermohonanComponent;
  let fixture: ComponentFixture<DataTambahanPermohonanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTambahanPermohonanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTambahanPermohonanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

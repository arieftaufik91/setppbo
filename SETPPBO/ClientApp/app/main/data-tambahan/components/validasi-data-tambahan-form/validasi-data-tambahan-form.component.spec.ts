import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidasiDataTambahanFormComponent } from './validasi-data-tambahan-form.component';

describe('ValidasiDataTambahanFormComponent', () => {
  let component: ValidasiDataTambahanFormComponent;
  let fixture: ComponentFixture<ValidasiDataTambahanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidasiDataTambahanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidasiDataTambahanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

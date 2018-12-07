import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidasiDataTambahanListComponent } from './validasi-data-tambahan-list.component';

describe('ValidasiDataTambahanListComponent', () => {
  let component: ValidasiDataTambahanListComponent;
  let fixture: ComponentFixture<ValidasiDataTambahanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidasiDataTambahanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidasiDataTambahanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

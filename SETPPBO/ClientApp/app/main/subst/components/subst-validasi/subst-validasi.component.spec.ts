import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstValidasiComponent } from './subst-validasi.component';

describe('SubstValidasiComponent', () => {
  let component: SubstValidasiComponent;
  let fixture: ComponentFixture<SubstValidasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstValidasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstValidasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

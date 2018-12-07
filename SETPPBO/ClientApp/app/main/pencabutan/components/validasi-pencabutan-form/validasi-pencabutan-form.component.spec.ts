import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidasiPencabutanFormComponent } from './validasi-pencabutan-form.component';

describe('ValidasiPencabutanFormComponent', () => {
  let component: ValidasiPencabutanFormComponent;
  let fixture: ComponentFixture<ValidasiPencabutanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidasiPencabutanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidasiPencabutanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

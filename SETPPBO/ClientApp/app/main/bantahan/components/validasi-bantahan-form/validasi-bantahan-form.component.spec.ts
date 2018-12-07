import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidasiBantahanFormComponent } from './validasi-bantahan-form.component';

describe('ValidasiBantahanFormComponent', () => {
  let component: ValidasiBantahanFormComponent;
  let fixture: ComponentFixture<ValidasiBantahanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidasiBantahanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidasiBantahanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

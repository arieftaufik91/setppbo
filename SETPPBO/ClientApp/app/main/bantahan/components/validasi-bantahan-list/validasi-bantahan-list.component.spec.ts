import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidasiBantahanListComponent } from './validasi-bantahan-list.component';

describe('ValidasiBantahanListComponent', () => {
  let component: ValidasiBantahanListComponent;
  let fixture: ComponentFixture<ValidasiBantahanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidasiBantahanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidasiBantahanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

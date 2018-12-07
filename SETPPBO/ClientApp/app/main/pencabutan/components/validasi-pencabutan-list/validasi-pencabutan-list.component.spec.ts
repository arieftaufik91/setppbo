import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidasiPencabutanListComponent } from './validasi-pencabutan-list.component';

describe('ValidasiPencabutanListComponent', () => {
  let component: ValidasiPencabutanListComponent;
  let fixture: ComponentFixture<ValidasiPencabutanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidasiPencabutanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidasiPencabutanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanPencabutanComponent } from './penetapan-pencabutan.component';

describe('PenetapanPencabutanComponent', () => {
  let component: PenetapanPencabutanComponent;
  let fixture: ComponentFixture<PenetapanPencabutanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanPencabutanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanPencabutanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

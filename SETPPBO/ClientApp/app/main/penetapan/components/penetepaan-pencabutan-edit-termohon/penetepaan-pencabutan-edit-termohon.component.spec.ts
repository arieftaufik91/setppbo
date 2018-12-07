import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetepaanPencabutanEditTermohonComponent } from './penetepaan-pencabutan-edit-termohon.component';

describe('PenetepaanPencabutanEditTermohonComponent', () => {
  let component: PenetepaanPencabutanEditTermohonComponent;
  let fixture: ComponentFixture<PenetepaanPencabutanEditTermohonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetepaanPencabutanEditTermohonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetepaanPencabutanEditTermohonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanPencabutanEditComponent } from './penetapan-pencabutan-edit.component';

describe('PenetapanPencabutanEditComponent', () => {
  let component: PenetapanPencabutanEditComponent;
  let fixture: ComponentFixture<PenetapanPencabutanEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanPencabutanEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanPencabutanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

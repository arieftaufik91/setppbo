import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanPencabutanAddDetailComponent } from './penetapan-pencabutan-add-detail.component';

describe('PenetapanPencabutanAddDetailComponent', () => {
  let component: PenetapanPencabutanAddDetailComponent;
  let fixture: ComponentFixture<PenetapanPencabutanAddDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanPencabutanAddDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanPencabutanAddDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

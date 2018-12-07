import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanPencabutanEditDetailComponent } from './penetapan-pencabutan-edit-detail.component';

describe('PenetapanPencabutanEditDetailComponent', () => {
  let component: PenetapanPencabutanEditDetailComponent;
  let fixture: ComponentFixture<PenetapanPencabutanEditDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanPencabutanEditDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanPencabutanEditDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

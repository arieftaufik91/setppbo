import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanPencabutanAddComponent } from './penetapan-pencabutan-add.component';

describe('PenetapanPencabutanAddComponent', () => {
  let component: PenetapanPencabutanAddComponent;
  let fixture: ComponentFixture<PenetapanPencabutanAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanPencabutanAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanPencabutanAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

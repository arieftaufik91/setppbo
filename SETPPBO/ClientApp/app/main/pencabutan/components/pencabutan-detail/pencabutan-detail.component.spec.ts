import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PencabutanDetailComponent } from './pencabutan-detail.component';

describe('PencabutanDetailComponent', () => {
  let component: PencabutanDetailComponent;
  let fixture: ComponentFixture<PencabutanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PencabutanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencabutanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PencabutanEditComponent } from './pencabutan-edit.component';

describe('PencabutanEditComponent', () => {
  let component: PencabutanEditComponent;
  let fixture: ComponentFixture<PencabutanEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PencabutanEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencabutanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

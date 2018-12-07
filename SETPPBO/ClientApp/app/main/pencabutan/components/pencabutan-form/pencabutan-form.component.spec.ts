import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PencabutanFormComponent } from './pencabutan-form.component';

describe('PencabutanFormComponent', () => {
  let component: PencabutanFormComponent;
  let fixture: ComponentFixture<PencabutanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PencabutanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencabutanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TandaTerimaPencabutanComponent } from './tanda-terima-pencabutan.component';

describe('TandaTerimaPencabutanComponent', () => {
  let component: TandaTerimaPencabutanComponent;
  let fixture: ComponentFixture<TandaTerimaPencabutanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TandaTerimaPencabutanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TandaTerimaPencabutanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

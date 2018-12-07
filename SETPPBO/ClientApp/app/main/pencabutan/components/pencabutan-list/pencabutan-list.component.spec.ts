import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PencabutanListComponent } from './pencabutan-list.component';

describe('PencabutanListComponent', () => {
  let component: PencabutanListComponent;
  let fixture: ComponentFixture<PencabutanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PencabutanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencabutanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanComponent } from './penetapan.component';

describe('PenetapanComponent', () => {
  let component: PenetapanComponent;
  let fixture: ComponentFixture<PenetapanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

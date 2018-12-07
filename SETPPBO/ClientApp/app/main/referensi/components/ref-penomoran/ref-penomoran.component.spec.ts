import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefPenomoranComponent } from './ref-penomoran.component';

describe('RefPenomoranComponent', () => {
  let component: RefPenomoranComponent;
  let fixture: ComponentFixture<RefPenomoranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefPenomoranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefPenomoranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

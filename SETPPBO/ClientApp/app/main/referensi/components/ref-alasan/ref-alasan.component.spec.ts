import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefAlasanComponent } from './ref-alasan.component';

describe('RefAlasanComponent', () => {
  let component: RefAlasanComponent;
  let fixture: ComponentFixture<RefAlasanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefAlasanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefAlasanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

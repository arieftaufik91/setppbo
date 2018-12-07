import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefHakimComponent } from './ref-hakim.component';

describe('RefHakimComponent', () => {
  let component: RefHakimComponent;
  let fixture: ComponentFixture<RefHakimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefHakimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefHakimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

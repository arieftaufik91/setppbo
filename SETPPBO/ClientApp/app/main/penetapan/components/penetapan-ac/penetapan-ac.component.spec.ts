import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanAcComponent } from './penetapan-ac.component';

describe('PenetapanAcComponent', () => {
  let component: PenetapanAcComponent;
  let fixture: ComponentFixture<PenetapanAcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanAcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanAcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

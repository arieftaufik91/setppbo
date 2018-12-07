import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BantahanDetailComponent } from './bantahan-detail.component';

describe('BantahanDetailComponent', () => {
  let component: BantahanDetailComponent;
  let fixture: ComponentFixture<BantahanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BantahanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BantahanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

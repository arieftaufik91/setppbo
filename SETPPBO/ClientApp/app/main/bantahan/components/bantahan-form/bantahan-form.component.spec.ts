import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BantahanFormComponent } from './bantahan-form.component';

describe('BantahanFormComponent', () => {
  let component: BantahanFormComponent;
  let fixture: ComponentFixture<BantahanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BantahanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BantahanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

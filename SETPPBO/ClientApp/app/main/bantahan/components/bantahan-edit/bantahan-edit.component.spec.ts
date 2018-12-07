import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BantahanEditComponent } from './bantahan-edit.component';

describe('BantahanEditComponent', () => {
  let component: BantahanEditComponent;
  let fixture: ComponentFixture<BantahanEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BantahanEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BantahanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

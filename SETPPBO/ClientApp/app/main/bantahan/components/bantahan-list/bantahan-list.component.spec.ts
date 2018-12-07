import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BantahanListComponent } from './bantahan-list.component';

describe('BantahanListComponent', () => {
  let component: BantahanListComponent;
  let fixture: ComponentFixture<BantahanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BantahanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BantahanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

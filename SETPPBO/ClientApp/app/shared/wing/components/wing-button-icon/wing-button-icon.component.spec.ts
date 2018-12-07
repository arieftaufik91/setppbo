import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WingButtonIconComponent } from './wing-button-icon.component';

describe('WingButtonIconComponent', () => {
  let component: WingButtonIconComponent;
  let fixture: ComponentFixture<WingButtonIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WingButtonIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WingButtonIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

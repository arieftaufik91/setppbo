import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WingDividerVerticalComponent } from './wing-divider-vertical.component';

describe('WingDividerVerticalComponent', () => {
  let component: WingDividerVerticalComponent;
  let fixture: ComponentFixture<WingDividerVerticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WingDividerVerticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WingDividerVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

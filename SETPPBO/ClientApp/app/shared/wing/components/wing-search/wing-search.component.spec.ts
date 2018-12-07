import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WingSearchComponent } from './wing-search.component';

describe('WingSearchComponent', () => {
  let component: WingSearchComponent;
  let fixture: ComponentFixture<WingSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WingSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

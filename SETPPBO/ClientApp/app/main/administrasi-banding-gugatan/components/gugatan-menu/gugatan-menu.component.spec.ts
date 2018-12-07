import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GugatanMenuComponent } from './gugatan-menu.component';

describe('GugatanMenuComponent', () => {
  let component: GugatanMenuComponent;
  let fixture: ComponentFixture<GugatanMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GugatanMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GugatanMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

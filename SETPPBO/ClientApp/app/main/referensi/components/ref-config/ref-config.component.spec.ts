import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefConfigComponent } from './ref-config.component';

describe('RefConfigComponent', () => {
  let component: RefConfigComponent;
  let fixture: ComponentFixture<RefConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

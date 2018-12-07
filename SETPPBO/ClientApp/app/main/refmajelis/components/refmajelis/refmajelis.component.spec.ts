import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefmajelisComponent } from './refmajelis.component';

describe('RefmajelisComponent', () => {
  let component: RefmajelisComponent;
  let fixture: ComponentFixture<RefmajelisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefmajelisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefmajelisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

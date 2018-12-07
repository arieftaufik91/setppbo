import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefPenomoranFormComponent } from './ref-penomoran-form.component';

describe('RefPenomoranFormComponent', () => {
  let component: RefPenomoranFormComponent;
  let fixture: ComponentFixture<RefPenomoranFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefPenomoranFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefPenomoranFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

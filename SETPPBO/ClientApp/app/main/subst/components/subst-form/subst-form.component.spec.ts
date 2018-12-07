import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstFormComponent } from './subst-form.component';

describe('SubstFormComponent', () => {
  let component: SubstFormComponent;
  let fixture: ComponentFixture<SubstFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

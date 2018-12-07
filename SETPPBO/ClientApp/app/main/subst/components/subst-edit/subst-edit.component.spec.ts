import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstEditComponent } from './subst-edit.component';

describe('SubstEditComponent', () => {
  let component: SubstEditComponent;
  let fixture: ComponentFixture<SubstEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

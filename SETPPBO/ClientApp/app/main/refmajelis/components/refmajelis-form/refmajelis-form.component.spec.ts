import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefmajelisFormComponent } from './refmajelis-form.component';

describe('RefmajelisFormComponent', () => {
  let component: RefmajelisFormComponent;
  let fixture: ComponentFixture<RefmajelisFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefmajelisFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefmajelisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefHakimFormComponent } from './ref-hakim-form.component';

describe('RefHakimFormComponent', () => {
  let component: RefHakimFormComponent;
  let fixture: ComponentFixture<RefHakimFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefHakimFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefHakimFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

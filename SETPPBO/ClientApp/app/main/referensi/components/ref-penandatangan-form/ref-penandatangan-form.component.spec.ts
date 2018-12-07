import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefPenandatanganFormComponent } from './ref-penandatangan-form.component';

describe('RefPenandatanganFormComponent', () => {
  let component: RefPenandatanganFormComponent;
  let fixture: ComponentFixture<RefPenandatanganFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefPenandatanganFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefPenandatanganFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

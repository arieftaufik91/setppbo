import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefPenandatanganComponent } from './ref-penandatangan.component';

describe('RefPenandatanganComponent', () => {
  let component: RefPenandatanganComponent;
  let fixture: ComponentFixture<RefPenandatanganComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefPenandatanganComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefPenandatanganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

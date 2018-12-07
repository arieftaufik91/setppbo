import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanEditDetailComponent } from './penetapan-edit-detail.component';

describe('PenetapanEditDetailComponent', () => {
  let component: PenetapanEditDetailComponent;
  let fixture: ComponentFixture<PenetapanEditDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanEditDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanEditDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

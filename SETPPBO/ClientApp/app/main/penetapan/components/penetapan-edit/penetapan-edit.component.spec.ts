import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanEditComponent } from './penetapan-edit.component';

describe('PenetapanEditComponent', () => {
  let component: PenetapanEditComponent;
  let fixture: ComponentFixture<PenetapanEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

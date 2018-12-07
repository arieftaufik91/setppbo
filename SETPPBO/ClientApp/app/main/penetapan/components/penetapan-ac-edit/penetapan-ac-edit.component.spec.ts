import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanAcEditComponent } from './penetapan-ac-edit.component';

describe('PenetapanAcEditComponent', () => {
  let component: PenetapanAcEditComponent;
  let fixture: ComponentFixture<PenetapanAcEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanAcEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanAcEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

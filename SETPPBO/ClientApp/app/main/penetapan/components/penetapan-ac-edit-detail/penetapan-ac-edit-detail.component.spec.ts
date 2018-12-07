import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanAcEditDetailComponent } from './penetapan-ac-edit-detail.component';

describe('PenetapanAcEditDetailComponent', () => {
  let component: PenetapanAcEditDetailComponent;
  let fixture: ComponentFixture<PenetapanAcEditDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanAcEditDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanAcEditDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

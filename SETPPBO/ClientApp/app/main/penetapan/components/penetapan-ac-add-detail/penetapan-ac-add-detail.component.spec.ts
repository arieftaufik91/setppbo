import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanAcAddDetailComponent } from './penetapan-ac-add-detail.component';

describe('PenetapanAcAddDetailComponent', () => {
  let component: PenetapanAcAddDetailComponent;
  let fixture: ComponentFixture<PenetapanAcAddDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanAcAddDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanAcAddDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanAddDetailComponent } from './penetapan-add-detail.component';

describe('PenetapanAddDetailComponent', () => {
  let component: PenetapanAddDetailComponent;
  let fixture: ComponentFixture<PenetapanAddDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanAddDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanAddDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

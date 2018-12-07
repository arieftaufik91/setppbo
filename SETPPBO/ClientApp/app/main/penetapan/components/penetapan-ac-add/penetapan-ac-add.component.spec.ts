import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanAcAddComponent } from './penetapan-ac-add.component';

describe('PenetapanAcAddComponent', () => {
  let component: PenetapanAcAddComponent;
  let fixture: ComponentFixture<PenetapanAcAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanAcAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanAcAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

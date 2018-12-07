import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenetapanAddComponent } from './penetapan-add.component';

describe('PenetapanAddComponent', () => {
  let component: PenetapanAddComponent;
  let fixture: ComponentFixture<PenetapanAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenetapanAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenetapanAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

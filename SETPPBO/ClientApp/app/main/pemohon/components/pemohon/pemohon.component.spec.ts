import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PemohonComponent } from './pemohon.component';

describe('PemohonComponent', () => {
  let component: PemohonComponent;
  let fixture: ComponentFixture<PemohonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PemohonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PemohonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

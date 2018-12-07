import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PemohonDetailComponent } from './pemohon-detail.component';

describe('PemohonDetailComponent', () => {
  let component: PemohonDetailComponent;
  let fixture: ComponentFixture<PemohonDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PemohonDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PemohonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

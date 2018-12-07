import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PemohonFormComponent } from './pemohon-form.component';

describe('PemohonFormComponent', () => {
  let component: PemohonFormComponent;
  let fixture: ComponentFixture<PemohonFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PemohonFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PemohonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

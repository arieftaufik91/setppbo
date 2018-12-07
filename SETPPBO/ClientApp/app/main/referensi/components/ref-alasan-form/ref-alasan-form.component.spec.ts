import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefAlasanFormComponent } from './ref-alasan-form.component';

describe('RefAlasanFormComponent', () => {
  let component: RefAlasanFormComponent;
  let fixture: ComponentFixture<RefAlasanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefAlasanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefAlasanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

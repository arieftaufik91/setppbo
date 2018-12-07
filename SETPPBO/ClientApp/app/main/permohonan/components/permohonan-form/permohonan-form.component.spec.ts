import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermohonanFormComponent } from './permohonan-form.component';

describe('PermohonanFormComponent', () => {
  let component: PermohonanFormComponent;
  let fixture: ComponentFixture<PermohonanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermohonanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermohonanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermohonanViewComponent } from './permohonan-view.component';

describe('PermohonanViewComponent', () => {
  let component: PermohonanViewComponent;
  let fixture: ComponentFixture<PermohonanViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermohonanViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermohonanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

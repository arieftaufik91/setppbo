import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermohonanInformationComponent } from './permohonan-information.component';

describe('PermohonanInformationComponent', () => {
  let component: PermohonanInformationComponent;
  let fixture: ComponentFixture<PermohonanInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermohonanInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermohonanInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

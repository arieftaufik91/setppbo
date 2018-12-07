import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermohonanDocumentComponent } from './permohonan-document.component';

describe('PermohonanDocumentComponent', () => {
  let component: PermohonanDocumentComponent;
  let fixture: ComponentFixture<PermohonanDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermohonanDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermohonanDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiTemplateFormComponent } from './referensi-template-form.component';

describe('ReferensiTemplateFormComponent', () => {
  let component: ReferensiTemplateFormComponent;
  let fixture: ComponentFixture<ReferensiTemplateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferensiTemplateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferensiTemplateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

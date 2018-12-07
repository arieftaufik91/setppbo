import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiTemplateListComponent } from './referensi-template-list.component';

describe('ReferensiTemplateListComponent', () => {
  let component: ReferensiTemplateListComponent;
  let fixture: ComponentFixture<ReferensiTemplateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferensiTemplateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferensiTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

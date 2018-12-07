import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefJenisPenomoranFormComponent } from './ref-jenis-penomoran-form.component';

describe('RefJenisPenomoranFormComponent', () => {
  let component: RefJenisPenomoranFormComponent;
  let fixture: ComponentFixture<RefJenisPenomoranFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefJenisPenomoranFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefJenisPenomoranFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

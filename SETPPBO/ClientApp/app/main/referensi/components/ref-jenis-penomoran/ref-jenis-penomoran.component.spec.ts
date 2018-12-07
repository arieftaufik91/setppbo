import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefJenisPenomoranComponent } from './ref-jenis-penomoran.component';

describe('RefJenisPenomoranComponent', () => {
  let component: RefJenisPenomoranComponent;
  let fixture: ComponentFixture<RefJenisPenomoranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefJenisPenomoranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefJenisPenomoranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

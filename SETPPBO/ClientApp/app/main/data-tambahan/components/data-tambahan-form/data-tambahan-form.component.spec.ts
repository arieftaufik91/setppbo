import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTambahanFormComponent } from './data-tambahan-form.component';

describe('DataTambahanFormComponent', () => {
  let component: DataTambahanFormComponent;
  let fixture: ComponentFixture<DataTambahanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTambahanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTambahanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

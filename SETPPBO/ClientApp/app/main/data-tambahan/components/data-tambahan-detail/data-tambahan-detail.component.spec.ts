import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTambahanDetailComponent } from './data-tambahan-detail.component';

describe('DataTambahanDetailComponent', () => {
  let component: DataTambahanDetailComponent;
  let fixture: ComponentFixture<DataTambahanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTambahanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTambahanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTambahanUploadComponent } from './data-tambahan-upload.component';

describe('DataTambahanUploadComponent', () => {
  let component: DataTambahanUploadComponent;
  let fixture: ComponentFixture<DataTambahanUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTambahanUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTambahanUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

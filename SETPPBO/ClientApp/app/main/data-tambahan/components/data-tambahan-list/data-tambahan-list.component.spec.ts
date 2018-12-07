import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTambahanListComponent } from './data-tambahan-list.component';

describe('DataTambahanListComponent', () => {
  let component: DataTambahanListComponent;
  let fixture: ComponentFixture<DataTambahanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTambahanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTambahanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

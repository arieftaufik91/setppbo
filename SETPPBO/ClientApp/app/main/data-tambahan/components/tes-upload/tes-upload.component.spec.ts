import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TesUploadComponent } from './tes-upload.component';

describe('TesUploadComponent', () => {
  let component: TesUploadComponent;
  let fixture: ComponentFixture<TesUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TesUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

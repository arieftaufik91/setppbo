import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCoverBerkasComponent } from './data-cover-berkas.component';

describe('DataCoverBerkasComponent', () => {
  let component: DataCoverBerkasComponent;
  let fixture: ComponentFixture<DataCoverBerkasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCoverBerkasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCoverBerkasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermohonanListComponent } from './permohonan-list.component';

describe('PermohonanListComponent', () => {
  let component: PermohonanListComponent;
  let fixture: ComponentFixture<PermohonanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermohonanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermohonanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

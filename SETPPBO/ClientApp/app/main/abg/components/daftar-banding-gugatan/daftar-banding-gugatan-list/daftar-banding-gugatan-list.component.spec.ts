import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarBandingGugatanListComponent } from './daftar-banding-gugatan-list.component';

describe('DaftarBandingGugatanListComponent', () => {
  let component: DaftarBandingGugatanListComponent;
  let fixture: ComponentFixture<DaftarBandingGugatanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaftarBandingGugatanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarBandingGugatanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
